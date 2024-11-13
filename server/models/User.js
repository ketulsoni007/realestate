import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  security_question: { type: String, required: true },
  phone_number: { type: String },
  role: { type: Schema.Types.ObjectId, ref: 'Role', required: true }, 
  status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

  // Admin-specific fields
  // permissions: [{ type: String }],
  // is_superadmin: { type: Boolean, default: false },
  // Agent/Broker-specific fields
  agency_name: { type: String },
  // assigned_properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  commission_rate: { type: Number },
  license_number: { type: String },

  // Client-specific fields
  // saved_properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  // viewed_properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
  // preferences: {
  //   location: { type: String },
  //   price_range: { type: Number }
  // }
});

const User = mongoose.model('User', userSchema);

export default User;
