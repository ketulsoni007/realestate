import { useSelector } from "react-redux";

const AdvancedSearch = () => {
  const allCategories = useSelector((state) => state.property.isPropertyCategoryList)
  return (
    <div className="p-3 border dark:border-dark">
      <h1 className="font-semibold">Advanced Search</h1>
      <div className="mt-3">
        <select name="" id="" className="filter">
          <option value="" disabled>Category</option>
          {allCategories && allCategories?.length > 0 ? (
            allCategories.map((item, index) => {
              return (
                <option value={item?.category}>{item?.category}</option>
              )
            })
          ) : (<option value="">No option available</option>)}
        </select>
      </div>
      <div className="mt-3">
        <select name="" id="" className="filter">
          <option value="">Price Range</option>
          <option value="$40,000 - $80,000">$40,000 - $80,000</option>
          <option value="$80,000 - $120,000">$80,000 - $120,000</option>
          <option value="$120,000 - $200,000">$120,000 - $200,000</option>
          <option value="$200,000 - $300,000">$200,000 - $300,000</option>
          <option value="$300,000 - $500,000">$300,000 - $500,000</option>
          <option value="$500,000 - $1000,000">$500,000 - $1000,000</option>
        </select>
      </div>
      <div className="mt-3">
        <select name="" id="" className="filter">
          <option value="">Purpose</option>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>
      </div>
      <div className="gap-2 mt-3 flex-align-center">
        <select name="" id="" className="filter">
          <option value="">Bathrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">Above 4</option>
        </select>
        <select name="" id="" className="filter">
          <option value="">Beds</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      <button className="btn bg-secondary w-full mt-4 text-slate-200 !rounded-none">
        search property
      </button>
    </div>
  );
};

export default AdvancedSearch;
