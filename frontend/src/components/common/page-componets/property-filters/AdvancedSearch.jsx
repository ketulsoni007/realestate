import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { propertyFilterListApi, SetPropertyFilter } from "store/Slices/propertySlice";

const AdvancedSearch = () => {
  const dispatch = useDispatch();

  // Get categories from Redux state
  const allCategories = useSelector((state) => state.property.isPropertyCategoryList);

  // Define price ranges
  const priceRanges = [
    { label: "Price Range", min: null, max: null },
    { label: "$0 - $10,000", min: 0, max: 10000 },
    { label: "$10,000 - $20,000", min: 10000, max: 20000 },
    { label: "$20,000 - $40,000", min: 20000, max: 40000 },
    { label: "$40,000 - $80,000", min: 40000, max: 80000 },
    { label: "$80,000 - $120,000", min: 80000, max: 120000 },
    { label: "$120,000 - $200,000", min: 120000, max: 200000 },
    { label: "$200,000 - $300,000", min: 200000, max: 300000 },
    { label: "$300,000 - $500,000", min: 300000, max: 500000 },
    { label: "$500,000 - $1,000,000", min: 500000, max: 1000000 },
  ];

  // State to manage filter values
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    purpose: "",
    bathrooms: "",
    beds: "",
  });

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Handle search submission
  const handleSubmit = () => {
    const selectedPriceRange = priceRanges[filters.priceRange];
    const payload = {
      category: filters.category,
      priceRange: selectedPriceRange
        ? { min: selectedPriceRange.min, max: selectedPriceRange.max }
        : null,
      purpose: filters.purpose,
      bathrooms: filters.bathrooms,
      beds: filters.beds,
    };
    dispatch(SetPropertyFilter(payload));
  };

  return (
    <div className="p-3 border dark:border-dark">
      <h1 className="font-semibold">Advanced Search</h1>

      {/* Category Filter */}
      <div className="mt-3">
        <select
          name="category"
          className="filter"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="" disabled>
            Category
          </option>
          {allCategories && allCategories.length > 0 ? (
            allCategories.map((item, index) => (
              <option key={index} value={item?.category}>
                {item?.category}
              </option>
            ))
          ) : (
            <option value="">No option available</option>
          )}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="mt-3">
        <select
          name="priceRange"
          className="filter"
          value={filters.priceRange}
          onChange={handleChange}
        >
          {priceRanges.map((range, index) => (
            <option key={index} value={index}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose Filter */}
      <div className="mt-3">
        <select
          name="purpose"
          className="filter"
          value={filters.purpose}
          onChange={handleChange}
        >
          <option value="">Purpose</option>
          <option value="sell">Sell</option>
          <option value="rent">Rent</option>
        </select>
      </div>

      {/* Bathrooms and Beds Filter */}
      <div className="gap-2 mt-3 flex-align-center">
        <select
          name="bathrooms"
          className="filter"
          value={filters.bathrooms}
          onChange={handleChange}
        >
          <option value="">Bathrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">Above 4</option>
        </select>
        <select
          name="beds"
          className="filter"
          value={filters.beds}
          onChange={handleChange}
        >
          <option value="">Beds</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>

      {/* Search Button */}
      <button
        className="btn bg-secondary w-full mt-4 text-slate-200 !rounded-none"
        onClick={handleSubmit}
      >
        Search Property
      </button>
    </div>
  );
};

export default AdvancedSearch;
