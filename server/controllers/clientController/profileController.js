import { configDotenv } from "dotenv";
import WishList from "../../models/WishList.js";

configDotenv;

export const profileWishListStoreController = async (req, res) => {
    try {
        const { user, property } = req.body;
        const existingWishList = await WishList.findOne({ user, property });
        if (existingWishList) {
            await WishList.findByIdAndDelete(existingWishList._id);
            return res.status(200).json({ message: "Property removed from wishlist" });
        } else {
            const newWishList = new WishList({
                property,
                user,
                type: 'save',
            });
            await newWishList.save();
            return res.status(200).json({ message: "Property added to wishlist" });
        }
    } catch (error) {
        console.error("Error handling wishlist:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};
