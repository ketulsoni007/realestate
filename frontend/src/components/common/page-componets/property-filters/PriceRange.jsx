import { useDispatch } from "react-redux";
import { useState } from "react";
import { propertyFilterListApi, SetPropertyFilter } from "store/Slices/propertySlice";

const PriceRange = () => {
  const dispatch = useDispatch();

  // State to track the selected budget
  const [selectedRange, setSelectedRange] = useState("");

  // Price range options
  const priceRanges = [
    {
      id: 1,
      name: "low budget",
      range: "$0k - 20k",
      budget: [0, 20],
    },
    {
      id: 2,
      name: "medium budget",
      range: "20k - 40k",
      budget: [20, 40],
    },
    {
      id: 3,
      name: "high budget",
      range: "40k - 100k",
      budget: [40, 100],
    },
    {
      id: 4,
      name: "luxury budget",
      range: "100k - above",
      budget: [100, null],
    },
  ];

  // Handle radio button change
  const handleOnChange = (budget, range) => {
    setSelectedRange(range); // Update local state with range (for UI display)
    const payload = { budget }; // Prepare payload with budget array
    dispatch(SetPropertyFilter(payload));
  };

  return (
    <div className="p-3 mt-8 border dark:border-dark">
      <h1 className="font-semibold">Price Range</h1>
      {priceRanges.map(({ id, name, range, budget }) => (
        <div key={id} className="mt-3 filter flex-center-between">
          <div className="input-radio">
            <input
              type="radio"
              name="price"
              id={name}
              value={range}
              checked={selectedRange === range}
              onChange={() => handleOnChange(budget, range)}
            />
            <label htmlFor={name} className="capitalize">
              {name}
            </label>
          </div>
          <p>{range}</p>
        </div>
      ))}
    </div>
  );
};

export default PriceRange;
