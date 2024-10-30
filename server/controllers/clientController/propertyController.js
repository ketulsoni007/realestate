import dotenv from "dotenv";
import Property from "../../models/Property.js";

dotenv.config();

export const propertyListController = async (req, res) => {
  try {
    const properties = await Property.find({
      featured: true,
      type: { $in: ['House', 'Apartment'] },
      availibility:'available'
    })
    .populate({
      path: 'images',
      match: { is_primary: true },
      select: '_id image is_primary',
    })
    .sort({ _id: 1 })
    .limit(6);
    
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyFeaturedController = async (req, res) => {
  try {
    const types = ['House', 'Apartment', 'Villa'];
    const properties = await Promise.all(
      types.map(type =>
        Property.findOne({ featured: true, type,availibility:'available' })
          .populate({
            path: 'images',
            match: { is_primary: true },
            select: '_id image is_primary',
          })
          .sort({ _id: 1 }) // Optionally sorts within each type, if multiple entries exist
      )
    );

    // Filter out any null values (in case no featured property was found for a type)
    const filteredProperties = properties.filter(property => property);

    res.status(200).json(filteredProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyCategoryController = async (req, res) => {
  try {
    // Define all possible categories
    const allCategories = ['House', 'Apartment', 'Commercial', 'Land', 'Office', 'Villa'];

    // Aggregate to get counts for existing categories
    const existingCategories = await Property.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1
        }
      }
    ]);

    // Merge all categories with existing counts, defaulting to 0 for missing ones
    const categories = allCategories.map((category) => {
      const found = existingCategories.find((item) => item.category === category);
      return {
        category,
        count: found ? found.count : 0
      };
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching property categories:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertySearchController = async (req, res) => {
  try {
    const { keyword } = req.query;
    const properties = await Property.find({ title: { $regex: keyword, $options: 'i' } }).select('_id title')
      .populate({
        path: 'images',
        match: { is_primary: true },
        select: '_id image is_primary',
      });
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyFilterController = async (req, res) => {
  try {
    const rowsPerPage = 8; // Set default number of rows per page
    const page = parseInt(req.query.page) || 0; // Get page from query params, default to 0 if undefined

    const properties = await Property.find({})
      .populate({
        path: 'images',
        match: { is_primary: true },
        select: '_id image is_primary',
      })
      .sort({ _id: 1 })
      .skip(page * rowsPerPage) // Skip documents based on page number
      .limit(rowsPerPage); // Limit the number of documents to rowsPerPage

    // Count total documents for pagination metadata
    const totalDocuments = await Property.countDocuments({});

    // Calculate total pages
    const totalPages = Math.ceil(totalDocuments / rowsPerPage);

    // Send properties with pagination metadata
    res.status(200).json({
      properties,
      pagination: {
        currentPage: page,
        rowsPerPage,
        totalPages,
        totalDocuments,
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
    .populate('address.country address.state address.city address.area')
      .populate('images')
      .populate({
        path:'owner',
        select:'_id first_name last_name email phone_number agency_name license_number'
      })
      .exec();

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property details:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};