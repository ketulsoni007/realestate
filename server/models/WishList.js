import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishListSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['seen', 'contact', 'save'], default: 'save' },
},{timestamps:true});

const WishList = mongoose.model('WishList', wishListSchema);

export default WishList;