import { useSelector } from "react-redux";
import SingleProductCardFullWidth from "./SingleProductCardFullWidth";
const PropertyFullWidth = ({properties}) => {
  // const { currentDataItems } = useSelector((state)=>state.data);
  return (
    <div>
      {properties && properties?.length > 0 && (
        properties.map((property,index)=>{
          return(<SingleProductCardFullWidth key={property._id} {...property} />)
        })
      )}
    </div>
  );
};

export default PropertyFullWidth;
