import mongoose from "mongoose";
const { Schema } = mongoose;

const countrySchema = new Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  isActive: {type: Boolean,default: true},
});

const Country = mongoose.model("Country", countrySchema);
export default Country;