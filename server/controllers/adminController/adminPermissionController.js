import mongoose from "mongoose";
import Role from "../../models/Role.js";
import Module from "../../models/Module.js";
import SubModule from "../../models/SubModule.js";
import AdminPanelAccess from "../../models/AdminPannelAccess.js";

export const roleListController = async (req, res) => {
  try {
    const { roleId,type } = req.query;
    let role;
    if(roleId && roleId !== 'undefined'){
      role = await Role.findById(roleId).populate({
        path: 'permissions.module',
        model: 'Module',
        select : 'name'
      })
      .populate({
        path: 'permissions.submodule.submodule', // Populate submodule correctly
        model: 'SubModule',
        select : 'name'
      })
      .exec();
    }else if(type && type !== 'undefined' && type === 'Access'){
      role = await AdminPanelAccess.find({})
        .populate({
          path:'role',
          select : '_id name purpose'
        })
        .exec();
    }else{
      role = await Role.find({}).select('_id name purpose isActive')
      .exec();
    }
    res.status(200).json(role);
  } catch (error) {
    console.error("Error getting Role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const roleStoreController = async (req, res) => {
  try {
    const { name, purpose, isActive } = req.body;
    const newRole = new Role({
      name,
      purpose,
      isActive: isActive ? isActive : false,
      permissions: []
    });
    const modules = await Module.find({}).populate('subModules');
    const permissions = modules.map((module) => {
      const permissionObject = {
        module: module._id,
        can_view: false,
        can_edit: false,
        can_create: false,
        can_delete: false,
        submodule: []
      };
      if (module.subModules && module.subModules.length > 0) {
        permissionObject.submodule = module.subModules.map(submodule => ({
          submodule: submodule._id,
          can_view: false,
          can_edit: false,
          can_create: false,
          can_delete: false
        }));
      }
      return permissionObject;
    });
    newRole.permissions = permissions;
    const savedRole = await newRole.save();
    await AdminPanelAccess.create({
      role: savedRole._id,
      access: false
    });
    res.status(200).json({ message: "Role created successfully" });
  } catch (error) {
    console.error("Error creating Role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const roleUpdateController = async (req, res) => {
  try {
      const { roleId } = req.params;
      const { name, purpose, isActive } = req.body;
      await Role.findByIdAndUpdate(
        roleId,
          {
              name,
              purpose,
              isActive: isActive ? isActive : false,
          }
      );
      res.status(200).json({ message: "Role updated successfully" });
  } catch (error) {
      console.error("Error updating State:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const roleDropdownController = async (req, res) => {
  try {
      const roles = await Role.find({ isActive: true });
      const dropdownOptions = roles.map(role => ({
          value: role._id,
          label: role.purpose,
      }));
      res.status(200).json(dropdownOptions);
  } catch (error) {
      console.error("Error getting countries:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const permissionStoreController = async (req, res) => {
  try {
    const { roleId, permissions } = req.body;

    // Parse the permissions if they are in string format
    const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : permissions;

    // Create the new permissions array
    const newPermissions = parsedPermissions.map(permission => {
      const { moduleId, can_view, can_edit, can_create, can_delete, subModules } = permission;
      return {
        module: new mongoose.Types.ObjectId(moduleId), // Ensure to use 'new'
        can_view,
        can_edit,
        can_create,
        can_delete,
        submodule: subModules && subModules?.length > 0 ? subModules.map(sub => ({
          submodule: new mongoose.Types.ObjectId(sub.subModuleId), // Use 'new' with ObjectId
          can_view: sub.can_view,
          can_edit: sub.can_edit,
          can_create: sub.can_create,
          can_delete: sub.can_delete
        })) : [] // If submodule is not an array, set it to an empty array
      };
    });
    // res.status(200).send(parsedPermissions); // Success with no content
    // Update the role with the new permissions
    await Role.findByIdAndUpdate(
      roleId,
      { permissions: newPermissions },
      { new: true }
    );

    res.status(200).send({ message: 'Role Created successfully' }); // Success with no content
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const roleDeleteController = async (req, res) => {
  try {
      const { ids } = req.body;
      const idToDelete = ids ? JSON.parse(ids) : [];
      if (idToDelete.length === 0) {
          return res.status(410).json({ message: "No Role IDs provided" });
      }
      await Role.deleteMany({ _id: { $in: idToDelete } });
      res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
      console.error("Error deleting Role:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



// export const rolePermissionStoreController = async (req, res) => {
//     try {
//         const RolesToUpdate = [
//             {
//                 "_id": "670e12b21a64707b3c723adf",
//                 "name": "Dashboard",
//                 "description": "",
//                 "icon": "DashboardIcon",
//                 "route": "/",
//                 "order": 1,
//                 "isActive": true,
//                 "subModules": [],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e13ad1a64707b3c723ae9",
//                 "name": "Role Management",
//                 "description": "",
//                 "icon": "PeopleIcon",
//                 "route": "",
//                 "order": 2,
//                 "isActive": true,
//                 "subModules": [
//                     {
//                         "_id": "670e4003e5702538cd85c2e5",
//                         "name": "Module",
//                         "description": "",
//                         "icon": "ViewModuleIcon",
//                         "route": "/module",
//                         "order": 1,
//                         "module": "670e13ad1a64707b3c723ae9",
//                         "isActive": true,
//                         "__v": 0
//                     },
//                     {
//                         "_id": "670e41c2da27c9eb2e0b1daf",
//                         "name": "Sub Module",
//                         "description": "",
//                         "icon": "ViewListIcon",
//                         "route": "/submodule",
//                         "order": 2,
//                         "module": "670e13ad1a64707b3c723ae9",
//                         "isActive": true,
//                         "__v": 0
//                     },
//                     {
//                         "_id": "670e5d3745fd983e8f825d65",
//                         "name": "permission",
//                         "description": "",
//                         "icon": "LockPersonIcon",
//                         "route": "/permission",
//                         "order": 3,
//                         "module": "670e13ad1a64707b3c723ae9",
//                         "isActive": true,
//                         "__v": 0
//                     }
//                 ],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e14051a64707b3c723af3",
//                 "name": "Regional Management",
//                 "description": "",
//                 "icon": "PublicIcon",
//                 "route": "",
//                 "order": 3,
//                 "isActive": true,
//                 "subModules": [
//                     {
//                         "_id": "670e4213da27c9eb2e0b1dc2",
//                         "name": "Country",
//                         "description": "",
//                         "icon": "FlagIcon",
//                         "route": "/country",
//                         "order": 1,
//                         "module": "670e14051a64707b3c723af3",
//                         "isActive": true,
//                         "__v": 0
//                     },
//                     {
//                         "_id": "670e423eda27c9eb2e0b1dd0",
//                         "name": "State",
//                         "description": "",
//                         "icon": "BalconyIcon",
//                         "route": "/state",
//                         "order": 2,
//                         "module": "670e14051a64707b3c723af3",
//                         "isActive": true,
//                         "__v": 0
//                     },
//                     {
//                         "_id": "670e425eda27c9eb2e0b1dde",
//                         "name": "City",
//                         "description": "",
//                         "icon": "LocationCityIcon",
//                         "route": "/city",
//                         "order": 3,
//                         "module": "670e14051a64707b3c723af3",
//                         "isActive": true,
//                         "__v": 0
//                     },
//                     {
//                         "_id": "670e4281da27c9eb2e0b1dec",
//                         "name": "Area",
//                         "description": "",
//                         "icon": "PlaceIcon",
//                         "route": "/area",
//                         "order": 4,
//                         "module": "670e14051a64707b3c723af3",
//                         "isActive": true,
//                         "__v": 0
//                     }
//                 ],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e185a902e8dc53f5a5911",
//                 "name": "Property",
//                 "description": "",
//                 "icon": "ApartmentIcon",
//                 "route": "/property",
//                 "order": 4,
//                 "isActive": true,
//                 "subModules": [],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e14211a64707b3c723afd",
//                 "name": "User",
//                 "description": "",
//                 "icon": "PersonIcon",
//                 "route": "/user",
//                 "order": 5,
//                 "isActive": true,
//                 "subModules": [],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e14471a64707b3c723b07",
//                 "name": "Product",
//                 "description": "",
//                 "icon": "ShoppingCartIcon",
//                 "route": "/products",
//                 "order": 6,
//                 "isActive": true,
//                 "subModules": [],
//                 "__v": 0
//             },
//             {
//                 "_id": "670e14631a64707b3c723b11",
//                 "name": "Blog",
//                 "description": "",
//                 "icon": "ArticleIcon",
//                 "route": "/blog",
//                 "order": 7,
//                 "isActive": true,
//                 "subModules": [],
//                 "__v": 0
//             }
//         ]
//         Role.findByIdUpdate();
//         await newRole.save();
//     } catch (error) {
//         console.error("Error creating State:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }