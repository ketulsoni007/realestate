import { useDispatch, useSelector } from "react-redux";
import { property } from "../../../data/dummyData";
import SingleProductCard from "./SingleProductCard";
import { useEffect } from "react";
import { propertyFeaturedListApi } from "store/Slices/propertySlice";

const Featured = () => {
  const dispatch = useDispatch();
  const isPropertyFeatureList = useSelector((state) => state.property.isPropertyFeatureList);
  useEffect(() => {
    dispatch(propertyFeaturedListApi());
  }, [dispatch])

  return (
    <div className="pt-10 pb-16">
      <div className="text-center">
        <h1 className="mx-auto sub-heading">featured</h1>
        <h1 className="heading">explore featured latest properties</h1>
      </div>
      <div className="flex flex-wrap gap-4 mt-8">
        {isPropertyFeatureList && isPropertyFeatureList.length > 0 ? (
          isPropertyFeatureList.map((item) => (
            <SingleProductCard key={item._id} {...item} />
          ))
        ) : null}
      </div>
    </div>
  );
};

export default Featured;
