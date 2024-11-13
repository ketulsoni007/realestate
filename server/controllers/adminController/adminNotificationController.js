import Contact from "../../models/Contact.js";
import State from "../../models/State.js";

export const notificationListController = async (req, res) => {
    const userId = req.userId;
    try {
        const notifications = await Contact.find({ seller: userId });
        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error getting State:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const notificationViewController = async (req, res) => {
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

export const notificationCountController = async (req, res) => {
    const userId = req.userId;
    try {
        const count = await Contact.countDocuments({ isRead: false, seller: userId });
        res.status(200).json(count); // Return the count as a response
    } catch (error) {
        console.error("Error fetching notification count:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};