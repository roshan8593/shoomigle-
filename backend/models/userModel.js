import mongoose from 'mongoose';
import userSchema from '../schema/userSchema.js';

const user = mongoose.model("user",userSchema);
export default user;