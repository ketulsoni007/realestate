import Module from "../../models/Module.js";
import Role from "../../models/Role.js";
import SubModule from "../../models/SubModule.js";

export const subModuleListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await SubModule.countDocuments({});
        const submodules = await SubModule.find({})
            .populate({
                path: 'module',
                select: '_id name',
            })
            .sort({ order: 1 })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        res.status(200).json({ totalCount, submodules });
    } catch (error) {
        console.error("Error getting City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const subModuleStoreController = async (req, res) => {
    try {
        const { name, description, module, icon, route, order, isActive } = req.body;
        await SubModule.updateMany(
            { module, order: { $gte: order } }, // Adjust orders of existing submodules
            { $inc: { order: 1 } } // Increment their order by 1
        );
        const newSubModule = new SubModule({
            name,
            description,
            icon,
            route,
            module,
            order,
            isActive: isActive ? isActive : false
        });
        await newSubModule.save();
        await Module.findByIdAndUpdate(
            module,
            { $push: { subModules: newSubModule._id } },
            { new: true }
        );
        await Role.updateMany(
            { "permissions.module": module }, // Match roles that have this module
            {
                $push: {
                    "permissions.$.submodule": {
                        submodule: newSubModule._id, // New submodule ID
                        can_view: false, // Default permission values
                        can_edit: false,
                        can_create: false,
                        can_delete: false
                    }
                }
            }
        );
        res.status(200).json({ message: "Sub Module created successfully" });
    } catch (error) {
        console.error("Error creating Sub Module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const subModuleUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, module, icon, route, order, isActive } = req.body;
        const existingSubModule = await SubModule.findById(id);
        if (!existingSubModule) {
            return res.status(404).json({ message: "Sub Module not found" });
        }
        if (existingSubModule.order !== order) {
            if (existingSubModule.order < order) {
                // Moving down in order
                await SubModule.updateMany(
                    { module, order: { $gt: existingSubModule.order, $lte: order } },
                    { $inc: { order: -1 } }
                );
            } else {
                // Moving up in order
                await SubModule.updateMany(
                    { module, order: { $lt: existingSubModule.order, $gte: order } },
                    { $inc: { order: 1 } }
                );
            }
        }

        if (existingSubModule.module.toString() !== module) {
            await Module.findByIdAndUpdate(
                existingSubModule.module,
                { $pull: { subModules: id } }
            );
            await Module.findByIdAndUpdate(
                module,
                { $push: { subModules: id } }
            );
        }
        await SubModule.findByIdAndUpdate(
            id,
            {
                name,
                description,
                icon,
                route,
                order,
                module,
                isActive: isActive ? isActive : false,
            }
        );
        res.status(200).json({ message: "Sub Module updated successfully" });
    } catch (error) {
        console.error("Error updating Sub Module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const subModuleDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        
        if (idToDelete.length === 0) {
            return res.status(410).json({ message: "No SubModule IDs provided" });
        }

        const subModulesToDelete = await SubModule.find({ _id: { $in: idToDelete } });
        if (subModulesToDelete.length === 0) {
            return res.status(410).json({ message: "No matching SubModules found" });
        }

        const moduleIds = subModulesToDelete.map((subModule) => subModule.module);
        
        // Step 1: Remove the submodules from their parent modules
        await Module.updateMany(
            { _id: { $in: moduleIds } },
            { $pull: { subModules: { $in: idToDelete } } }
        );

        // Step 2: Update roles to remove permissions for deleted submodules
        await Role.updateMany(
            {},
            {
                $pull: {
                    "permissions.$[].submodule": {
                        submodule: { $in: idToDelete }
                    }
                }
            }
        );

        // Step 3: Delete submodules
        await SubModule.deleteMany({ _id: { $in: idToDelete } });

        // Step 4: Adjust orders of remaining submodules
        await SubModule.updateMany(
            { module: { $in: moduleIds }, order: { $gte: Math.min(...subModulesToDelete.map(sub => sub.order)) } },
            { $inc: { order: -1 } } // Decrement their order by 1
        );

        res.status(200).json({ message: "SubModules deleted successfully" });
    } catch (error) {
        console.error("Error deleting SubModules:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const subModuleDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const submodule = await SubModule.findById(id);
        if (!submodule) {
            return res.status(410).json({ message: "sub module not found" });
        }
        res.status(200).json(submodule);
    } catch (error) {
        console.error("Error fetching sub module details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const subModuleDropdownController = async (req, res) => {
    try {
        const submodules = await SubModule.find({ isActive: true });
        const dropdownOptions = submodules.map(item => ({
            value: item._id,
            label: item.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting submodules:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};