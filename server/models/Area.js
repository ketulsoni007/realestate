import mongoose from "mongoose";
const { Schema } = mongoose;

const areaSchema = new Schema({
  name: { type: String, required: true, unique: true },
  city: { type: Schema.Types.ObjectId, ref: "City", required: true },
  isActive: {type: Boolean,default: true},
});

const Area = mongoose.model("Area", areaSchema);
export default Area;