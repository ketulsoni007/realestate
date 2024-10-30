import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const moduleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  icon: { type: String },
  route: { type: String },
  order: { type: Number },
  isActive: { type: Boolean, default: true },
  subModules: [{ type: Schema.Types.ObjectId, ref: 'SubModule' }]
});

const Module = mongoose.model('Module', moduleSchema);
export default Module;
