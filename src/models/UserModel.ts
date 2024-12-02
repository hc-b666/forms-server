import { Schema, model } from 'mongoose';

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  isBlocked: { type: Boolean, default: false },
});

export default model('User', UserSchema);
