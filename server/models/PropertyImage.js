import mongoose from "mongoose";
const Schema = mongoose.Schema;

const propertyImageSchema = new Schema({
  property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },  // Reference to the related property
  image: { type: String, required: true },
  is_primary: { type: Boolean, default: false },  // Marks the primary image of the property
  uploaded_at: { type: Date, default: Date.now },  // Date when the image was uploaded
});

const PropertyImage = mongoose.model('PropertyImage', propertyImageSchema);

export default PropertyImage;