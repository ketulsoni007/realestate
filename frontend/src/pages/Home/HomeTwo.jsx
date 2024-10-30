import { Backdrop } from "@mui/material";
import {
  Featured,
  Feeds,
  Projects,
  Testimonial,
  WhatWeDo,
} from "../../components/common/page-componets";
import { Filters, Hero, LatestForSale } from "../../components/home/home-2";
import Search from "../../components/home/home-2/Search";
import { useDispatch, useSelector } from "react-redux";
import { PropertySearchListReset, PropertySearchText } from "store/Slices/propertySlice";

const HomeTwo = () => {
  const dispatch = useDispatch();
  const isPropertySearchList = useSelector((state) => state.property.isPropertySearchList);
  return (
    <div className="pt-16 px-[3%] md:px-[6%]">
      <Hero />
      <Backdrop open={isPropertySearchList && isPropertySearchList?.length > 0} sx={{ backgroundColor: 'transparent' }} onClick={() => {
        dispatch(PropertySearchListReset())
        dispatch(PropertySearchText(''))
      }} />
      <Filters />
      <Projects />
      <WhatWeDo />
      <Featured />
      <LatestForSale />
      <Search />
      <Testimonial />
      <Feeds />
    </div>
  );
};

export default HomeTwo;
