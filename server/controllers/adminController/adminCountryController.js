import Country from "../../models/Country.js";

export const countryListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await Country.countDocuments({});
        const countries = await Country.find({})
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        res.status(200).json({ totalCount, countries });
    } catch (error) {
        console.error("Error getting countries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const countryStoreController = async (req, res) => {
    try {
        const { name, code, isActive } = req.body;
        const newCountry = new Country({
            name,
            code,
            isActive: isActive ? isActive : false
        });
        await newCountry.save();
        res.status(200).json({ message: "Country created successfully" });
    } catch (error) {
        console.error("Error creating country:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const countryUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, code, isActive } = req.body;
        await Country.findByIdAndUpdate(
            id,
            {
                name,
                code,
                isActive: isActive ? isActive : false,
            }
        );
        res.status(200).json({ message: "Country updated successfully" });
    } catch (error) {
        console.error("Error updating country:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const countryDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        if (idToDelete.length === 0) {
            return res.status(400).json({ message: "No country IDs provided" });
        }
        await Country.deleteMany({ _id: { $in: idToDelete } });
        res.status(200).json({ message: "Countries deleted successfully" });
    } catch (error) {
        console.error("Error deleting countries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const countryDropdownController = async (req, res) => {
    try {
        const countries = await Country.find({ isActive: true });
        const dropdownOptions = countries.map(country => ({
            value: country._id,
            label: country.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting countries:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const countryDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const country = await Country.findById(id);
        if (!country) {
            return res.status(410).json({ message: "Country not found" });
        }
        res.status(200).json(country);
    } catch (error) {
        console.error("Error fetching country details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};