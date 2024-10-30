import { BiBed, BiMap, BiMapAlt, BiTab } from "react-icons/bi";
import { Link } from "react-router-dom";
import { property } from "../../../data/dummyData";
import CardHoverIcons from "../../common/page-componets/CardHoverIcons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { propertyListApi } from "store/Slices/propertySlice";
import config from "config/config";

const LatestForSale = () => {
  const dispatch = useDispatch();
  const properties = useSelector((state)=>state.property.ispropertyListData);
  const darkMode = useSelector((state)=>state.ui.darkMode)

  useEffect(()=>{
      dispatch(propertyListApi())
  },[dispatch])

  return (
    <div className="pt-10 pb-16">
      <div className="text-center">
        <h1 className="mx-auto sub-heading">latest for sale</h1>
        <h1 className="heading">featured property for sale</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {properties && properties?.length > 0 && (
          properties.map((item,index)=>{
            const image = item?.images?.length > 0 ? item?.images[0] : '';
            return(
              <div className="relative grid grid-cols-1 gap-3 mt-3 overflow-hidden border rounded-lg shadow-light sm:grid-cols-3 dark:border-card-dark group" key={index}>
                <div className="sm:col-span-1">
                  <div className="group !opacity-100 overflow-hidden relative h-full">
                    <Link to="/" className="!opacity-100">
                      <img
                        src={`${config.IMAGE_URL}/property/${image?.image}`}
                        alt={item?.title}
                        className="object-cover w-full h-full group-hover:scale-125 transition-a"
                      />
                    </Link>
                    <CardHoverIcons />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="mt-3 flex-align-center gap-x-2">
                    <span className="py-[3px] px-3 rounded-full capitalize  bg-primary/20 text-primary">
                    {item?.type}
                    </span>
                    <span className={`py-[3px] px-3 rounded-full capitalize ${darkMode ? 'bg-white/20 text-white' : 'bg-secondary/20 text-secondary'}`}>
                    {/* <span className="py-[3px] px-3 rounded-full capitalize  "> */}
                      for {item?.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <Link
                      to="/"
                      className="group-hover:text-primary transition-a"
                    >
                      <h1 className="text-lg font-bold capitalize">{item?.title}</h1>
                    </Link>

                    <div className="mt-2 flex-align-center gap-x-2">
                      <BiMap />
                      <p>{item?.address?.street}</p>
                    </div>

                    <div className="flex justify-between mt-3">
                      <div className="flex-align-center gap-x-2">
                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                          <BiBed />
                        </div>
                        <p className="text-sm">{item?.bedrooms} Beds</p>
                      </div>
                      <div className="flex-align-center gap-x-2">
                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                          <BiTab />
                        </div>
                        <p className="text-sm">
                          {item?.bathrooms} Bathrooms
                        </p>
                      </div>
                      <div className="flex-align-center gap-x-2">
                        <div className="icon-box !w-7 !h-7 bg-primary/20 hover:!bg-primary/40 text-primary">
                          <BiMapAlt />
                        </div>
                        <p className="text-sm">{item?.square_footage}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex-center-between">
                      <h1 className="text-lg font-semibold text-primary">
                        ${item?.price}
                      </h1>
                      <button className="btn btn-secondary">details</button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      <div className="mt-4 flex-center-center">
        <button className="btn btn-primary">view more</button>
      </div>
    </div>
  );
};

export default LatestForSale;