import { useSelector } from "react-redux";
import SingleProductCard from "../../common/page-componets/SingleProductCard";

const PropertyList = ({ properties }) => {
  return (
    <div className="flex flex-wrap gap-4">
      {properties && properties?.length > 0 && (
        properties.map((property,index)=>{
          return(
            <SingleProductCard key={property._id} {...property}  />
          )
        })
      )}
    </div>
  );
};

export default PropertyList;
