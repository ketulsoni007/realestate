import Module from "../../models/Module.js";
import Role from "../../models/Role.js";

// export const moduleSidebarController = async (req, res) => {
//     try {
//         const sidebar = await Module.find({})
//             .sort({ order: 1 })
//             .populate({
//                 path: 'subModules',
//                 options: { sort: { order: 1 } },
//             });

//         res.status(200).json(sidebar);
//     } catch (error) {
//         console.error("Error getting sidebar:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };

export const moduleSidebarController = async (req, res) => {
    try {
        const roleId = req.role;
        const userRole = await Role.findById(roleId)
            .populate('permissions.module')
            .populate('permissions.submodule');

        if (!userRole) {
            return res.status(403).json({ message: "User role not found" });
        }

        // Step 1: Get the IDs of modules and submodules the user can view
        const viewableModules = userRole.permissions
            .filter(permission => permission.can_view || permission.can_edit || permission.can_create || permission.can_delete)
            .map(permission => permission.module); // Module IDs

        const viewableSubmodules = userRole.permissions.flatMap(permission =>
            permission.submodule
                .filter(sub => sub.can_view || sub.can_edit || sub.can_create || sub.can_delete)
                .map(sub => sub.submodule) // Submodule IDs
        );

        // Step 2: Find all modules the user can view
        const sidebar = await Module.find({ _id: { $in: viewableModules }, isActive: true })
            .sort({ order: 1 })
            .populate({
                path: 'subModules',
                match: { _id: { $in: viewableSubmodules }, isActive: true }, // Match only viewable submodules
                options: { sort: { order: 1 } },
            });

        // Step 3: Format the sidebar data
        const formattedSidebar = sidebar.map(module => ({
            _id: module._id,
            name: module.name,
            description: module.description,
            icon: module.icon,
            route: module.route,
            order: module.order,
            isActive: module.isActive,
            subModules: module.subModules || [], // Ensure subModules is an empty array if not found
        }));

        // Step 4: Filter out modules without viewable submodules and without a route
        const filteredSidebar = formattedSidebar.filter(module =>
            module.route || module.subModules.length > 0 // Keep module if it has a route or has viewable submodules
        );

        res.status(200).json(filteredSidebar);
    } catch (error) {
        console.error("Error getting sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const modulePermissionListController = async (req, res) => {
    try {
        const roleId = req.role;
        const userRole = await Role.findById(roleId)
            .select('permissions')
            .populate({
                path: 'permissions.module',
                select: 'name' // Select only the name field from the module
            })
            .populate({
                path: 'permissions.submodule.submodule', // Populate the submodule field
                select: 'name' // Select only the name field from the submodule
            });

        res.status(200).json(userRole);
    } catch (error) {
        console.error("Error getting sidebar:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const moduleListController = async (req, res) => {
    const { page = 0, rowsPerPage = 5 } = req.query;
    try {
        const totalCount = await Module.countDocuments({});
        const modules = await Module.find({})
            .sort({ order: 1 })
            .skip(page * rowsPerPage)
            .limit(rowsPerPage);
        res.status(200).json({ totalCount, modules });
    } catch (error) {
        console.error("Error getting City:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const moduleStoreController = async (req, res) => {
    try {
        const { name, description, icon, route, order, isActive } = req.body;
        const newModule = new Module({
            name,
            description,
            icon,
            route,
            order,
            isActive: isActive ? isActive : false
        });
        await newModule.save();
        await Role.updateMany(
            {}, // Match all roles
            {
                $push: {
                    permissions: {
                        module: newModule._id, // New module ID
                        can_view: false, // Default permission values
                        can_edit: false,
                        can_create: false,
                        can_delete: false,
                        submodule: [] // Initialize with an empty array for submodules
                    }
                }
            }
        );
        res.status(200).json({ message: "Module created successfully" });
    } catch (error) {
        console.error("Error creating Module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const moduleUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, icon, route, order, isActive } = req.body;
        const existingModule = await Module.findById(id);

        if (!existingModule) {
            return res.status(410).json({ message: "Module not found" });
        }

        if (existingModule.order !== order) {
            if (existingModule.order < order) {
                await Module.updateMany(
                    { order: { $gt: existingModule.order, $lte: order } },
                    { $inc: { order: -1 } }
                );
            } else {
                await Module.updateMany(
                    { order: { $gte: order, $lt: existingModule.order } },
                    { $inc: { order: 1 } }
                );
            }
        }
        await Module.findByIdAndUpdate(
            id,
            {
                name,
                description,
                icon,
                route,
                order,
                isActive: isActive ? isActive : false
            }
        );
        res.status(200).json({ message: "Module updated successfully" });
    } catch (error) {
        console.error("Error updating Module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const moduleDeleteController = async (req, res) => {
    try {
        const { ids } = req.body;
        const idToDelete = ids ? JSON.parse(ids) : [];
        if (idToDelete.length === 0) {
            return res.status(400).json({ message: "No Module IDs provided" });
        }

        // Step 1: Find the orders of the modules to delete
        const modulesToDelete = await Module.find({ _id: { $in: idToDelete } });

        // Step 2: Extract orders of the modules being deleted
        const ordersToDelete = modulesToDelete.map(module => module.order);

        // Step 3: Delete permissions from roles
        await Role.updateMany(
            {},
            {
                $pull: {
                    permissions: {
                        module: { $in: idToDelete }
                    }
                }
            }
        );

        // Step 4: Delete the modules
        await Module.deleteMany({ _id: { $in: idToDelete } });

        // Step 5: Adjust the order of the remaining modules
        await Module.updateMany(
            { order: { $in: ordersToDelete } }, // Adjust orders of modules with affected orders
            { $inc: { order: -1 } } // Decrement their order by 1
        );

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error("Error deleting Module:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const moduleDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        const module = await Module.findById(id);
        if (!module) {
            return res.status(410).json({ message: "module not found" });
        }
        res.status(200).json(module);
    } catch (error) {
        console.error("Error fetching City details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const moduleDropdownController = async (req, res) => {
    try {
        const modules = await Module.find({ isActive: true });
        const dropdownOptions = modules.map(item => ({
            value: item._id,
            label: item.name,
        }));
        res.status(200).json(dropdownOptions);
    } catch (error) {
        console.error("Error getting modules:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};