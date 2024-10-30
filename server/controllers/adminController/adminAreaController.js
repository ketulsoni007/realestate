import Area from "../../models/Area.js";

export const areaListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await Area.countDocuments({});
        const areas = await Area.find({})
            .populate({
                path: 'city',
                select: '_id name',
                populate: {
                    path: 'state',
                    select: '_id name',
                    populate: {
                        path: 'country',
                        select: '_id name',
                    },
                },
            })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);

        res.status(200).json({ totalCount, areas });
    } catch (error) {
        console.error("Error getting Areas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const areaStoreController = async (req, res) => {
    try {
        const { name, city, isActive } = req.body;
        const newArea = new Area({
            name,
            city,
            isActive: isActive ? isActive : false
        });
        await newArea.save();
        res.status(200).json({ message: "Area created successfully" });
    } catch (error) {
        console.error("Error creating Area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const areaUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, city, isActive } = req.body;
        await Area.findByIdAndUpdate(
            id,
            {
                name,
                city,
                isActive: isActive ? isActive : false,
            }
        );
        res.status(200).json({ message: "Area updated successfully" });
    } catch (error) {
        console.error("Error updating Area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const areaDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        if (idToDelete.length === 0) {
            return res.status(400).json({ message: "No Area IDs provided" });
        }
        await Area.deleteMany({ _id: { $in: idToDelete } });
        res.status(200).json({ message: "Area deleted successfully" });
    } catch (error) {
        console.error("Error deleting Area:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const areaDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const area = await Area.findById(id);
        if (!area) {
            return res.status(410).json({ message: "Area not found" });
        }
        res.status(200).json(area);
    } catch (error) {
        console.error("Error fetching Area details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const areaDropdownController = async (req, res) => {
    const { cityId } = req.query;
    try {
        const query = { isActive: true };
        if (cityId && cityId !== 'undefined') {
            query.city = cityId;
        }
        const areas = await Area.find(query);
        const dropdownOptions = areas.map(area => ({
            value: area._id,
            label: area.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting areas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};