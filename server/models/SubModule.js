import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const subModuleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
    route: { type: String },
    order: { type: Number },
    module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },  // Reference to the parent module
    isActive: { type: Boolean, default: true },
});

const SubModule = mongoose.model('SubModule', subModuleSchema);
export default SubModule;
