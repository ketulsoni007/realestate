import City from "../../models/City.js";

export const cityListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await City.countDocuments({});
        const cities = await City.find({})
            .populate({
                path: 'state',
                select: '_id name',
                populate: {
                    path: 'country',
                    select: '_id name',
                },
            })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);

        res.status(200).json({ totalCount, cities });
    } catch (error) {
        console.error("Error getting City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cityStoreController = async (req, res) => {
    try {
        const { name, state, isActive } = req.body;
        const newCity = new City({
            name,
            state,
            isActive: isActive ? isActive : false
        });
        await newCity.save();
        res.status(200).json({ message: "City created successfully" });
    } catch (error) {
        console.error("Error creating City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const cityUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, state, isActive } = req.body;
        await City.findByIdAndUpdate(
            id,
            {
                name,
                state,
                isActive: isActive ? isActive : false,
            }
        );
        res.status(200).json({ message: "City updated successfully" });
    } catch (error) {
        console.error("Error updating City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cityDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        if (idToDelete.length === 0) {
            return res.status(400).json({ message: "No City IDs provided" });
        }
        await City.deleteMany({ _id: { $in: idToDelete } });
        res.status(200).json({ message: "City deleted successfully" });
    } catch (error) {
        console.error("Error deleting City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cityDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findById(id);
        if (!city) {
            return res.status(410).json({ message: "City not found" });
        }
        res.status(200).json(city);
    } catch (error) {
        console.error("Error fetching City details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const stateDropdownController = async (req, res) => {
    const { countryId } = req.query;
    try {
        const query = { isActive: true };
        if (countryId && countryId !== 'undefined') {
            query.country = countryId;
        }
        const states = await State.find(query);
        const dropdownOptions = states.map(state => ({
            value: state._id,
            label: state.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting states:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const cityDropdownController = async (req, res) => {
    const { stateId } = req.query;
    try {
        const query = { isActive: true };
        if (stateId && stateId !== 'undefined') {
            query.state = stateId;
        }
        const cities = await City.find(query);
        const dropdownOptions = cities.map(state => ({
            value: state._id,
            label: state.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting states:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};