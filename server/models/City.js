import mongoose from "mongoose";
const { Schema } = mongoose;

const citySchema = new Schema({
  name: { type: String, required: true, unique: true },
  state: { type: Schema.Types.ObjectId, ref: "State", required: true },
  isActive: {type: Boolean,default: true},
});

const City = mongoose.model("City", citySchema);
export default City;