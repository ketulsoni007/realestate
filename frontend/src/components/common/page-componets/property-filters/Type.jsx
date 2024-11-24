import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { propertyFilterListApi, SetPropertyFilter } from "store/Slices/propertySlice";

const Type = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector((state) => state.property.isPropertyCategoryList);
  const isPropertyFilter = useSelector((state) => state.property.isPropertyFilter);
  console.log('isPropertyFilter: ', isPropertyFilter);

  const handleOnChange = (type) => {
    const payload = { type };
    dispatch(SetPropertyFilter(payload));
  };

  return (
    <div className="p-3 mt-8 border dark:border-dark">
      <h1 className="font-semibold">Property Type</h1>

      {/* Render property categories */}
      {allCategories && allCategories.length > 0 ? (
        allCategories.map((item, index) => (
          <div key={index} className="mt-3 filter flex-center-between">
            <div className="input-radio">
              <input
                type="radio"
                name="type"
                id={item?.category}
                value={item?.category}
                checked={isPropertyFilter?.type === item?.category}
                onChange={() => handleOnChange(item?.category)}
              />
              <label htmlFor={item?.category} className="capitalize">
                {item?.category}
              </label>
            </div>
            <p>({item?.count})</p>
          </div>
        ))
      ) : (
        <p className="mt-3 text-gray-500">No property types available</p>
      )}
    </div>
  );
};

export default Type;
