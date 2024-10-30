import { Link } from "react-router-dom";
import { projects } from "../../../data/dummyData";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { propertyCategoryListApi } from "store/Slices/propertySlice";
import Apartment from "assets/images/property (17).jpg";
import Office from "assets/images/property (1).jpg";
import House from "assets/images/property (21).jpg";
import Villa from "assets/images/villa.jpeg";
import Commercial from "assets/images/commercial.jpg";
import Land from "assets/images/land.jpg";

const categoryImages = {
  Apartment,
  Office,
  House,
  Villa,
  Commercial,
  Land,
};

const Projects = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.property.isPropertyCategoryList)
  useEffect(() => {
    dispatch(propertyCategoryListApi())
  }, [])

  return (
    <div className="pt-10 pb-16">
      <div className="text-center">
        <h1 className="mx-auto sub-heading">our projects</h1>
        <h1 className="heading">excellent projects both small and complex</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3">
        {allCategories?.length > 0 && (
          allCategories.map((item, index) => {
            return (
              <div key={index} className="relative w-full group">
                <div className="overflow-hidden">
                  <Link className="!opacity-100">
                    <img
                      src={categoryImages[item.category] || Apartment}  // Default to Apartment if category not found
                      alt={item.category}
                      className="w-full h-fit md:h-[250px] object-cover group-hover:scale-125 transition-a"
                    />
                  </Link>
                </div>
                <div className="absolute bottom-0 left-0 w-full px-2 py-2 transition-transform bg-gradient-to-t from-black/80 text-slate-100 to-transparent">
                  <h1 className="text-lg font-semibold">{item.category}</h1>
                  <p>{item.count} Poperty</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default Projects;
