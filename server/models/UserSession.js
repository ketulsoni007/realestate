import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  panel:{ type: String, required: true },
  created_at: { type: Date, default: Date.now },
  expired_at: { type: Date },
});

const UserSession = mongoose.model('UserSession', userSessionSchema);
export default UserSession;