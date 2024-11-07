import fs from "fs";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import * as XLSX from 'xlsx/xlsx.mjs';
import Property from "../../models/Property.js";
import PropertyImage from "../../models/PropertyImage.js";
import City from "../../models/City.js";
import Area from "../../models/Area.js";
import Country from "../../models/Country.js";
import State from "../../models/State.js";
import ExcelJS from 'exceljs';

dotenv.config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/property");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files"); // Define your storage location
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });
const uploadFile = multer({ storage: uploadStorage }).single('file');

export const propertyImportController = (req, res) => {
  uploadFile(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }

    try {
      const userId = req.userId;
      const filePath = req.file.path;

      if (!fs.existsSync(filePath)) {
        return res.status(400).json({ message: "File does not exist." });
      }

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.worksheets[0];

      const unimportedData = [];

      const existingTitles = await Property.find({}).distinct("title");

      const [countries, cities, states, areas] = await Promise.all([
        Country.find({}),
        City.find({}),
        State.find({}),
        Area.find({})
      ]);

      const countryOptions = countries.map(country => country.name);
      const cityOptions = cities.map(city => city.name);
      const stateOptions = states.map(state => state.name);
      const areaOptions = areas.map(area => area.name);

      const countryMap = Object.fromEntries(countries.map(country => [country.name, country._id]));
      const stateMap = Object.fromEntries(states.map(state => [state.name, state._id]));
      const cityMap = Object.fromEntries(cities.map(city => [city.name, city._id]));
      const areaMap = Object.fromEntries(areas.map(area => [area.name, area._id]));

      // Iterate over rows, starting from the second row (index 2)
      for (let rowIndex = 2; rowIndex <= worksheet.lastRow.number; rowIndex++) {
        const row = worksheet.getRow(rowIndex);
        const property = {
          title: row.getCell(1).value,
          description: row.getCell(2).value,
          price: row.getCell(3).value,
          country: row.getCell(4).value,
          state: row.getCell(5).value,
          city: row.getCell(6).value,
          area: row.getCell(7).value,
          street: row.getCell(8).value,
          zip_code: row.getCell(9).value,
          status: row.getCell(10).value,
          type: row.getCell(11).value,
          bedrooms: row.getCell(12).value,
          bathrooms: row.getCell(13).value,
          square_footage: row.getCell(14).value,
          lot_size: row.getCell(15).value,
          year_built: row.getCell(16).value,
          availability: row.getCell(17).value,
        };

        const errorsForProperty = validateProperty(property, existingTitles, countryOptions, stateOptions, cityOptions, areaOptions);

        if (Object.keys(errorsForProperty).length > 0) {
          unimportedData.push({ property, errors: errorsForProperty });
          continue; // Skip this property and continue with the next
        }

        const newProperty = new Property({
          title: property.title,
          description: property.description,
          price: property.price,
          address: {
            country: countryMap[property.country],
            state: stateMap[property.state],
            city: cityMap[property.city],
            area: areaMap[property.area],
            street: property.street,
            zip_code: property.zip_code
          },
          status: property.status,
          type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          square_footage: property.square_footage,
          lot_size: property.lot_size,
          year_built: property.year_built,
          availability: property.availability || 'available',
          owner: userId,
        });

        await newProperty.save();
      }

      // Delete the uploaded file after processing
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting the file:", unlinkErr);
        }
      });

      if (unimportedData.length > 0) {
        return res.status(400).json({
          message: "Some properties could not be imported",
          unimportedData,
        });
      }

      res.status(200).json({ message: "Properties imported successfully" });

    } catch (error) {
      console.error("Error importing properties:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

const validateProperty = (property, existingTitles, countryOptions, stateOptions, cityOptions, areaOptions) => {
  const errors = {};

  if (!property.title) {
    errors.title = "Title is required";
  } else if (existingTitles.includes(property.title)) {
    errors.title = "Property already exists";
  }

  if (property.country && !countryOptions.includes(property.country)) {
    errors.country = "Invalid country";
  }

  if (property.state && !stateOptions.includes(property.state)) {
    errors.state = "Invalid state";
  }

  if (property.city && !cityOptions.includes(property.city)) {
    errors.city = "Invalid city";
  }

  if (property.area && !areaOptions.includes(property.area)) {
    errors.area = "Invalid area";
  }

  return errors;
};

export const propertyExampleController = async (req, res) => {
  try {
    const PROPERTY_TYPE_OPTION = ['House', 'Apartment', 'Commercial', 'Land'];
    const countries = await Country.find({});
    const PROPERTY_COUNTRY_OPTION = countries.map((country) => country.name);
    const cities = await City.find({});
    const PROPERTY_CITY_OPTION = cities.map((city) => city.name);
    const states = await State.find({});
    const PROPERTY_STATE_OPTION = states.map((state) => state.name);
    const areas = await Area.find({});
    const PROPERTY_AREA_OPTION = areas.map((area) => area.name);

    // Create validation formulas
    const typeValidationFormula = `"${PROPERTY_TYPE_OPTION.join(',')}"`;
    const cityValidationFormula = `"${PROPERTY_CITY_OPTION.join(',')}"`;
    const areaValidationFormula = `"${PROPERTY_AREA_OPTION.join(',')}"`;
    const countryValidationFormula = `"${PROPERTY_COUNTRY_OPTION.join(',')}"`;
    const stateValidationFormula = `"${PROPERTY_STATE_OPTION.join(',')}"`;

    // Sample data structure for the Excel file
    const sampleData = [
      {
        title: "",
        description: "",
        price: 0,
        country: "",
        state: "",
        city: "",
        area: "",
        street: "",  // Ensure consistent use of lowercase for keys
        zip_code: "", // Corrected to match the key in worksheet.columns
        type: "",     // Keep this empty for the dropdown
        bedrooms: "", // Use lowercase to match keys defined in worksheet.columns
        bathrooms: "",
        square_footage: "",
        lot_size: "",
        year_built: new Date().getFullYear(),
        status: "",
        availibility: "available",
        isActive: "true",
      },
    ];

    // Create a new workbook and add the worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sample Properties");

    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Area', key: 'area', width: 20 },
      { header: 'Street', key: 'street', width: 20 },
      { header: 'Zip Code', key: 'zip_code', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Bedrooms', key: 'bedrooms', width: 10 },
      { header: 'Bathrooms', key: 'bathrooms', width: 10 },
      { header: 'Square Footage', key: 'square_footage', width: 15 },
      { header: 'Lot Size', key: 'lot_size', width: 15 },
      { header: 'Year Built', key: 'year_built', width: 15 },
      { header: 'Property Availability', key: 'availibility', width: 20 },
      { header: 'Active', key: 'isActive', width: 10 },
    ];
    sampleData.forEach(data => {
      worksheet.addRow(data);
    });

    worksheet.getColumn('type').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [typeValidationFormula], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Type',
          error: 'Please select a valid property type from the dropdown.',
        };
      }
    });

    // Set data validation for City column
    worksheet.getColumn('country').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [countryValidationFormula], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Country',
          error: 'Please select a valid Country from the dropdown.',
        };
      }
    });
    worksheet.getColumn('state').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [stateValidationFormula], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid State',
          error: 'Please select a valid State from the dropdown.',
        };
      }
    });
    worksheet.getColumn('city').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [cityValidationFormula], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid City',
          error: 'Please select a valid city from the dropdown.',
        };
      }
    });

    worksheet.getColumn('area').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [areaValidationFormula], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });
    worksheet.getColumn('status').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"sale,rent"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });
    worksheet.getColumn('availibility').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"available,sold,pending"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });
    worksheet.getColumn('isActive').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"true,false"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });

    // Generate a buffer for the Excel file
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Set response headers
    res.setHeader('Content-Disposition', 'attachment; filename=sample_properties.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error exporting properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const propertyExportController = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you extract user info from the token or session

    // Fetch properties owned by the current user, including populated fields
    const properties = await Property.find({ owner: userId })
      .populate('address.country address.state address.city address.area');

    if (!properties || properties.length === 0) {
      return res.status(404).json({ message: "No properties found for this user." });
    }

    // Fetch dropdown options
    const countries = await Country.find({});
    const cities = await City.find({});
    const states = await State.find({});
    const areas = await Area.find({});

    const COUNTRY_OPTIONS = countries.map((country) => country.name);
    const CITY_OPTIONS = cities.map((city) => city.name);
    const STATE_OPTIONS = states.map((state) => state.name);
    const AREA_OPTIONS = areas.map((area) => area.name);

    // Create a new workbook and add the worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("User Properties");

    // Define the columns for the worksheet
    worksheet.columns = [
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Description', key: 'description', width: 30 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Country', key: 'country', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Area', key: 'area', width: 20 },
      { header: 'Street', key: 'street', width: 20 },
      { header: 'Zip Code', key: 'zip_code', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Type', key: 'type', width: 20 },
      { header: 'Bedrooms', key: 'bedrooms', width: 10 },
      { header: 'Bathrooms', key: 'bathrooms', width: 10 },
      { header: 'Square Footage', key: 'square_footage', width: 15 },
      { header: 'Lot Size', key: 'lot_size', width: 15 },
      { header: 'Year Built', key: 'year_built', width: 15 },
      { header: 'Property Availability', key: 'availibility', width: 20 },
      { header: 'Active', key: 'isActive', width: 10 },
    ];

    // Add property data to the worksheet
    properties.forEach((property) => {
      worksheet.addRow({
        title: property.title || '',
        description: property.description || '',
        price: property.price || 0,
        country: property.address.country ? property.address.country.name : '',
        state: property.address.state ? property.address.state.name : '',
        city: property.address.city ? property.address.city.name : '',
        area: property.address.area ? property.address.area.name : '',
        street: property.address.street || '',
        zip_code: property.address.zip_code || '',
        status: property.status || '',
        type: property.type || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        square_footage: property.square_footage || '',
        lot_size: property.lot_size || '',
        year_built: property.year_built || '',
        availibility: property.availibility || 'available',
        isActive: property.isActive ? "true" : "false",
      });
    });

    // Add data validation for dropdowns
    const countryValidationFormula = `"${COUNTRY_OPTIONS.join(',')}"`;
    const stateValidationFormula = `"${STATE_OPTIONS.join(',')}"`;
    const cityValidationFormula = `"${CITY_OPTIONS.join(',')}"`;
    const areaValidationFormula = `"${AREA_OPTIONS.join(',')}"`;

    worksheet.getColumn('country').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [countryValidationFormula],
          showErrorMessage: true,
          errorTitle: 'Invalid Country',
          error: 'Please select a valid Country from the dropdown.',
        };
      }
    });

    worksheet.getColumn('state').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [stateValidationFormula],
          showErrorMessage: true,
          errorTitle: 'Invalid State',
          error: 'Please select a valid State from the dropdown.',
        };
      }
    });

    worksheet.getColumn('city').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [cityValidationFormula],
          showErrorMessage: true,
          errorTitle: 'Invalid City',
          error: 'Please select a valid city from the dropdown.',
        };
      }
    });

    worksheet.getColumn('area').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: [areaValidationFormula],
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });
    worksheet.getColumn('status').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"sale,rent"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });
    worksheet.getColumn('availibility').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"available,sold,pending"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });

    worksheet.getColumn('isActive').eachCell((cell, rowNumber) => {
      if (rowNumber > 1) { // Skip header row
        cell.dataValidation = {
          type: 'list',
          allowBlank: true,
          formulae: ['"true,false"'], // Correct usage
          showErrorMessage: true,
          errorTitle: 'Invalid Area',
          error: 'Please select a valid area from the dropdown.',
        };
      }
    });

    // Generate a buffer for the Excel file
    const excelBuffer = await workbook.xlsx.writeBuffer();

    // Set response headers for file download
    res.setHeader('Content-Disposition', 'attachment; filename=user_properties.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    // Send the buffer as the response
    res.send(excelBuffer);
  } catch (error) {
    console.error("Error exporting properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const propertyStoreController = async (req, res) => {
  upload.array("images")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err?.message || "Error uploading file",
        error: err.message,
      });
    }

    try {
      const { title, description, price, street, city, state, zip_code, country, type, bedrooms, bathrooms, square_footage, lot_size, year_built, status, isActive, area, availibility } = req.body;
      const newProperty = new Property({
        title,
        description,
        price,
        address: {
          street,
          city,
          state,
          zip_code,
          country,
          area,
        },
        type,
        bedrooms,
        availibility,
        bathrooms,
        square_footage,
        lot_size,
        year_built,
        status,
        owner: req.userId,
        isActive: isActive ? isActive : false,
        updated_at: Date.now(),
      });

      const createdProperty = await newProperty.save();

      // Ensure that images are processed correctly
      const imagePromises = req.files.map((file, index) => {
        const newPropertyImage = new PropertyImage({
          property: createdProperty._id,
          image: file.filename, // Make sure filenames are unique
          is_primary: index === 0,
        });
        return newPropertyImage.save();
      });

      const savedImages = await Promise.all(imagePromises);

      // Push the saved image IDs to the property
      createdProperty.images.push(...savedImages.map(img => img._id));
      await createdProperty.save();

      res.status(200).json({
        status: true,
        message: "Property created successfully",
        data: createdProperty, // Optionally return created property data
      });
    } catch (error) {
      console.log("Error creating property:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const propertyUpdateController = async (req, res) => {
  const { id } = req.params;
  upload.array("images")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        status: false,
        message: err?.message || "Error uploading file",
        error: err.message,
      });
    }

    try {
      const property = await Property.findById(id).populate('images');

      if (!property) {
        return res.status(404).json({ status: false, message: "Property not found" });
      }

      const { title, description, price, street, city, state, zip_code, country, type, bedrooms, bathrooms, square_footage, lot_size, year_built, status, isActive, area, availibility } = req.body;
      // Update property fields
      property.title = title;
      property.description = description;
      property.price = price;
      property.address = { street, city, state, zip_code, country, area };
      property.type = type;
      property.bedrooms = bedrooms;
      property.bathrooms = bathrooms;
      property.square_footage = square_footage;
      property.lot_size = lot_size;
      property.year_built = year_built;
      property.status = status;
      property.availibility = availibility;
      property.isActive = isActive ? isActive : false;

      // Handle old images
      const { old_images } = req.body; // Assuming old_images is passed as a JSON string
      const prevOldImages = old_images ? JSON.parse(old_images) : [];

      // Find images to keep and those to delete
      const currentImageIds = property.images.map(img => img._id.toString());
      const imagesToDelete = property.images.filter(img => !prevOldImages.some(oldImg => oldImg._id === img._id.toString()));

      // Delete removed images from the file system
      for (const img of imagesToDelete) {
        fs.unlink(path.join('public/images/property', img.image), (err) => {
          if (err) console.log(`Error deleting image ${img.image}:`, err);
        });
        await PropertyImage.findByIdAndDelete(img._id); // Remove from database
      }
      const hasPrimaryImage = property.images.some(img => img.is_primary);

      // Save new images
      if (req.files && req.files.length > 0) {
        const newImagePromises = req.files.map((file, index) => {
          const isPrimary = !hasPrimaryImage && index === 0;  // Only set primary if no primary exists and this is the first new image
          const newPropertyImage = new PropertyImage({
            property: property._id,
            image: file.filename,
            is_primary: isPrimary,
          });
          return newPropertyImage.save();
        });
        const savedImages = await Promise.all(newImagePromises);
        property.images.push(...savedImages.map(img => img._id));
      }

      // Save updated property
      await property.save();

      res.status(200).json({
        status: true,
        message: "Property updated successfully",
        data: property,
      });
    } catch (error) {
      console.log("Error updating property:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const propertyFeatureUpdateController = async (req, res) => {
  const { _id, featured } = req.body;
  try {
    const property = await Property.findById(_id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    property.featured = featured == true || featured == "true";
    await property.save();
    res.status(200).json({
      message: "Property updated successfully",
    });
  } catch (error) {
    console.log("Error updating property:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyDeleteController = async (req, res) => {
  const { ids } = req.body;
  const idToDelete = ids ? JSON.parse(ids) : [];
  try {
    const properties = await Property.find({ _id: { $in: idToDelete } }).populate('images');
    if (!properties.length) {
      return res.status(404).json({
        status: false,
        message: "No properties found for the provided IDs",
      });
    }
    for (const property of properties) {
      for (const img of property.images) {
        const imgPath = path.join('public/images/property', img.image);
        fs.unlink(imgPath, (err) => {
          if (err) console.log(`Error deleting image ${img.image}:`, err);
        });
        await PropertyImage.findByIdAndDelete(img._id);
      }
      await Property.findByIdAndDelete(property._id);
    }
    res.status(200).json({
      status: true,
      message: "Properties deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting properties:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyDetailController = async (req, res) => {
  const { id } = req.params; // Extract the property ID from the request parameters

  try {
    // Find the existing property
    const property = await Property.findById(id).populate('images');

    if (!property) {
      return res.status(410).json({
        message: "Property not found",
      });
    }
    res.status(200).json(property);
  } catch (error) {
    console.log("Error fetching property:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const propertyListController = async (req, res) => {
  const { page = 0, rowsPerPage = 5 } = req.query;
  try {
    const totalCount = await Property.countDocuments({ owner: req.userId });

    const properties = await Property.find({ owner: req.userId })
      .select('_id title price status type isActive featured')
      .populate({
        path: 'address.area',
        select: '_id name',
      })
      .populate({
        path: 'images',
        match: { is_primary: true },
        select: '_id image is_primary',
      })
      .skip(page * rowsPerPage)
      .limit(rowsPerPage);

    res.status(200).json({ totalCount, properties });
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}