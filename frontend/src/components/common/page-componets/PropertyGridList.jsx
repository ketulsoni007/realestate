import { useSelector } from "react-redux";
import SingleProductCardFullWidth from "./SingleProductCardFullWidth";

const PropertyGridList = ({ textLength, showLabels }) => {
  const { currentDataItems } = useSelector((state)=>state.data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentDataItems?.map((property) => (
        <SingleProductCardFullWidth
          key={property.id}
          {...property}
          textLength={textLength}
          showLabels
        />
      ))}
    </div>
  );
};

export default PropertyGridList;
