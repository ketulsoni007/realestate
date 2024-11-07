import { useDispatch, useSelector } from "react-redux";
import { property } from "../../../data/dummyData";
import SingleProductCard from "./SingleProductCard";
import { useEffect } from "react";
import { propertyFeaturedListApi } from "store/Slices/propertySlice";
import { Box, Skeleton } from "@mui/material";
import Grid from '@mui/material/Grid2';
import useWindowWidth from "hooks/windowWidth";

const Featured = () => {
  const dispatch = useDispatch();
  const width = useWindowWidth();
  const isPropertyFeatureList = useSelector((state) => state.property.isPropertyFeatureList);
  const isApiStatus = useSelector((state) => state.property.isApiStatus);
  const featureLoading = isApiStatus?.propertyFeaturedListApi === "loading";
  useEffect(() => {
    dispatch(propertyFeaturedListApi());
  }, [dispatch])

  return (
    <div className="pt-10 pb-16">
      <div className="text-center">
        <h1 className="mx-auto sub-heading">featured</h1>
        <h1 className="heading">explore featured latest properties</h1>
      </div>
      {featureLoading ? (
        <Box sx={{ flexGrow: 1 }} mt={8}>
          <Grid container spacing={2}>
            {Array.from({ length: width < 900 ? 4 : 3 }).map((_, index) => (
              <Grid size={{ xs: 6, md: 4 }} key={index}>
                <Skeleton variant="rectangular" width="100%" height={350} />
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
      <div className="flex flex-wrap gap-4 mt-8">
        {isPropertyFeatureList && isPropertyFeatureList.length > 0 ? (
          isPropertyFeatureList.map((item) => (
            <SingleProductCard key={item._id} {...item} />
          ))
        ) : null}
      </div>
      )}
    </div>
  );
};

export default Featured;
