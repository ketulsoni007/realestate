import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// AdminPanelAccess Schema
const adminPanelAccessSchema = new Schema({
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true, unique: true },
  access: { type: Boolean, required: true, default: true },
});

const AdminPanelAccess = mongoose.model('AdminPanelAccess', adminPanelAccessSchema);
export default AdminPanelAccess;