import mongoose from "mongoose";
const { Schema } = mongoose;

const contactSchema = new Schema({
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    property: { type: Schema.Types.ObjectId, ref: "Property",required: true },
    name: { type: String },
    email: { type: String },
    inquiry: { type: String, enum: ['visit', 'contact', 'detail'], default: 'visit' },  // Status of the property
    accept:{ type: Boolean, default: true },
    isRead: { type: Boolean, default: true },
},{timestamps:true});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;