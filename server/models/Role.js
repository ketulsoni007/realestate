import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Role Schema
const roleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  purpose: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  permissions: [
    {
      module: { type: Schema.Types.ObjectId, ref: 'Module' },
      can_view: { type: Boolean, default: false },
      can_edit: { type: Boolean, default: false },
      can_create: { type: Boolean, default: false },
      can_delete: { type: Boolean, default: false },
      submodule: [
        {
          submodule: { type: Schema.Types.ObjectId, ref: 'SubModule' },
          can_view: { type: Boolean, default: false },
          can_edit: { type: Boolean, default: false },
          can_create: { type: Boolean, default: false },
          can_delete: { type: Boolean, default: false }
        }
      ]
    }
  ]
});

const Role = mongoose.model('Role', roleSchema);
export default Role;
