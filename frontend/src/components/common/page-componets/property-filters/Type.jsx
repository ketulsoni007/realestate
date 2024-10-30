import { useSelector } from "react-redux";
// import { propertyTypes } from "../../../../data/dummyData";

const Type = () => {
  const allCategories = useSelector((state) => state.property.isPropertyCategoryList)
  return (
    <div className="p-3 mt-8 border dark:border-dark">
      <h1 className="font-semibold">Property Type</h1>
      {allCategories && allCategories?.length > 0 && (
        allCategories.map((item, index) => {
          return (
            <div key={index} className="mt-3 filter flex-center-between">
              <div className="input-radio">
                <input type="radio" name="type" id={item?.category} />
                <label htmlFor={item?.category} className="capitalize">
                  {item?.category}
                </label>
              </div>
              <p>({item?.count})</p>
            </div>
          )
        })
      )}
    </div>
  );
};

export default Type;
