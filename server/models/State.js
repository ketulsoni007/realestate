import mongoose from "mongoose";
const { Schema } = mongoose;

const stateSchema = new Schema({
  name: { type: String, required: true, unique: true },
  country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
  isActive: {type: Boolean,default: true},
});

const State = mongoose.model("State", stateSchema);
export default State;