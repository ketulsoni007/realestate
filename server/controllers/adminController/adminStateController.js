import State from "../../models/State.js";

export const stateListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await State.countDocuments({});
        const states = await State.find({}).populate('country')
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        res.status(200).json({ totalCount, states });
    } catch (error) {
        console.error("Error getting State:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const stateStoreController = async (req, res) => {
    try {
        const { name, country, isActive } = req.body;
        const newState = new State({
            name,
            country,
            isActive: isActive ? isActive : false
        });
        await newState.save();
        res.status(200).json({ message: "State created successfully" });
    } catch (error) {
        console.error("Error creating State:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const stateUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, country, isActive } = req.body;
        await State.findByIdAndUpdate(
            id,
            {
                name,
                country,
                isActive: isActive ? isActive : false,
            }
        );
        res.status(200).json({ message: "State updated successfully" });
    } catch (error) {
        console.error("Error updating State:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const stateDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        if (idToDelete.length === 0) {
            return res.status(400).json({ message: "No State IDs provided" });
        }
        await State.deleteMany({ _id: { $in: idToDelete } });
        res.status(200).json({ message: "State deleted successfully" });
    } catch (error) {
        console.error("Error deleting State:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const stateDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const state = await State.findById(id);
        if (!state) {
            return res.status(410).json({ message: "State not found" });
        }
        res.status(200).json(state);
    } catch (error) {
        console.error("Error fetching State details:", error);
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