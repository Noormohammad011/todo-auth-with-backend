import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';

// import { Task } from '../tasks/tasks.model';
import {
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
  IUser,
} from './auth.interface';
import { User } from './auth.model';

const createUser = async (payload: IUser): Promise<IUser | null> => {
  const user = await User.create(payload);
  return user;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;
  const isUserExist = await User.isUserExist(email);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const { _id, email: userEmail } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { _id, email: userEmail },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { _id, email: userEmail },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }

  const { _id } = verifiedToken;

  const isUserExist = await User.findById({
    _id,
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const newAccessToken = jwtHelpers.createToken(
    {
      _id: isUserExist._id,
      email: isUserExist.email,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

// const logoutUser = async (
//   userId: string,
// ): Promise<IRefreshTokenResponse | null> => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   return {
//     accessToken: '',
//   };
// };

const resetPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
): Promise<IRefreshTokenResponse | null> => {
  const isUserExist = await User.findById(userId).select('+password');
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  isUserExist.password = newPassword;
  await isUserExist.save();
  const newAccessToken = jwtHelpers.createToken(
    { _id: isUserExist._id, email: isUserExist.email },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const userProfile = async (userId: string): Promise<IUser | null> => {
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await User.findById(userId)
    .populate({
      path: 'tasks',
      select: 'title description isCompleted',
      match: {
        isCompleted: {
          $eq: true,
        },
      },
    })
    .exec();
  return result;
};


// Future implementation for deleting user and all tasks associated with it || When role based auth is implemented
// const deleteUser = async (userId: string): Promise<IUser | null> => {
//   const isUserExist = await User.findById(userId);
//   if (!isUserExist) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
//   }
//   const result = await User.findByIdAndDelete(userId);
//   await Task.deleteMany({ user: userId });
//   return result;
// };

export const UserService = {
  createUser,
  loginUser,
  refreshToken,
  userProfile,
  // logoutUser,
  resetPassword,
  // deleteUser,
};
