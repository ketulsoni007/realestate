import mongoose from "mongoose";
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  title: { type: String, required: true },  // Name or title of the property (e.g., "Beautiful Family Home")
  description: { type: String },  // Detailed description of the property
  price: { type: Number, required: true },  // Price of the property
  address: {
    country: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    state: { type: Schema.Types.ObjectId, ref: 'State', required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    area: { type: Schema.Types.ObjectId, ref: 'Area', required: true },
    street: { type: String, required: true },
    zip_code: { type: String, required: true },
  },
  status: { 
    type: String, 
    enum: ['sale', 'rent'], // Add other categories as needed
    required: true 
  },
  featured: {type: Boolean,default: false},
  type: { type: String, enum: ['House', 'Apartment', 'Commercial', 'Land','Office','Villa'], required: true },  // Type of property
  bedrooms: { type: Number },  // Number of bedrooms
  bathrooms: { type: Number },  // Number of bathrooms
  square_footage: { type: Number },  // Total square footage of the property
  lot_size: { type: Number },  // Lot size, if applicable
  year_built: { type: Number },  // Year the property was built
  availibility: { type: String, enum: ['available', 'sold', 'pending'], default: 'available' },  // Status of the property
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },  // Owner or agent who listed the property
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  // video: { type: String, required: true },
  images: [{ type: Schema.Types.ObjectId, ref: 'PropertyImage' }],  // Array of image references
  isActive: {type: Boolean,default: true},
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
