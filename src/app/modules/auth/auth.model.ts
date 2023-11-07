import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../../config';
import { IUser, UserModel } from './auth.interface';
// import { Task } from '../tasks/tasks.model';


const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);



userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bycrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

userSchema.statics.isUserExist = async function (email: string) {
  return await this.findOne({ email }).select('_id email name password');
};

// Future implementation for deleting user and all tasks associated with it || When role based auth is implemented
// userSchema.pre(
//   'deleteOne',
//   { document: false, query: true },
//   async function () {
//     const doc = await this.model.findOne(this.getFilter());
//     await Task.deleteMany({ user: doc._id });
//   },
// );


//virtual populate
userSchema.virtual('tasks', {
  ref: 'Tasks',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });


export const User = model<IUser, UserModel>('User', userSchema);
