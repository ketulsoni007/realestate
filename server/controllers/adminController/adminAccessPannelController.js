import AdminPanelAccess from "../../models/AdminPannelAccess.js";
import Role from "../../models/Role.js";

export const accessPannelListController = async (req, res) => {
    try {
        const roles = await AdminPanelAccess.find({}).populate('Role');
        res.status(200).json(roles);
    } catch (error) {
        console.error("Error getting Areas:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const accessPannelStoreController = async (req, res) => {
    try {
      const roles = await Role.find({});
      const adminPanelAccessData = roles.map((role) => ({
        role: role._id,
        access: false
      }));
      await AdminPanelAccess.insertMany(adminPanelAccessData);
      res.status(200).json({ message: "Roles added to Admin Panel Access successfully" });
    } catch (error) {
      console.error("Error adding roles to Admin Panel Access:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

export const accessPannelUpdateController = async (req, res) => {
    try {
        const { id } = req.params;
        const { access } = req.body;
        await AdminPanelAccess.findByIdAndUpdate(
            id,
            {
                access: access ? access : false,
            }
        );
        res.status(200).json({ message: "Access updated successfully" });
    } catch (error) {
        console.error("Error updating Access:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};