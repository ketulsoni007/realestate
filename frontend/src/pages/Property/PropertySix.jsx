import { useEffect, useState } from "react";
import { FiDelete } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  AdvancedSearch,
  CTA,
  HeadeFilters,
  Pagination,
  PriceRange,
  PropertyFullWidth,
  SocialIcons,
  Type,
} from "../../components/common/page-componets";
import { PropertyList } from "../../components/property";
import { property } from "../../data/dummyData";
import { closeFilterMenu } from "../../store/Slices/uiSlice";
import { propertyCategoryListApi, propertyFilterListApi } from "store/Slices/propertySlice";
import { Skeleton } from "@mui/material";
import noResult from '../../assets/images/noresult.png';
import { CommonButton, CustomText } from "components/fields/field";

const PropertySix = () => {
  const dispatch = useDispatch();
  const [pageNumber, setPageNumber] = useState([]);
  // console.log('paginatedProperties: ', paginatedProperties);
  const { isFilterMenuOpen, darkMode } = useSelector((state) => state.ui);
  const isPropertyFilterList = useSelector((state) => state.property.isPropertyFilterList);
  const isPropertyFilter = useSelector((state) => state.property.isPropertyFilter);
  console.log('isPropertyFilter: ', isPropertyFilter);
  const pagination = isPropertyFilterList?.pagination;
  console.log('pagination: ', pagination);
  const currentPage = pagination?.currentPage || 0;
  const rowsPerPage = pagination?.rowsPerPage || 8;
  const totalPages = pagination?.totalPages || 0;
  const totalDocuments = pagination?.totalDocuments || 0;
  const isApiStatus = useSelector((state) => state.property.isApiStatus);
  const filterPropertyLoading = isApiStatus?.propertyFilterListApi === 'loading';
  const properties = isPropertyFilterList && isPropertyFilterList?.properties && isPropertyFilterList?.properties?.length > 0 ? isPropertyFilterList?.properties : [];
  const handleCloseFiltermenu = (e) => {
    if (e.target.classList.contains("filter-modal"))
      dispatch(closeFilterMenu());
  };

  const [layout, setLayout] = useState("list");

  useEffect(() => {
    dispatch(propertyFilterListApi({ page: 0, rowsPerPage: rowsPerPage,type:isPropertyFilter?.type }));
    dispatch(propertyCategoryListApi());
  }, [dispatch,isPropertyFilter]);

  const handlePageChange = (selectedPage) => {
    const page = selectedPage + 1;
    dispatch(propertyFilterListApi({ page: page, rowsPerPage: rowsPerPage,type:isPropertyFilter?.type }));
  };
  

  const renderSkeleton = () => {
    return layout === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={150}
              sx={{
                backgroundColor: darkMode ? "rgba(50, 50, 50, 0.6)" : "rgba(200, 200, 200, 0.6)", // Adjusted colors
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "1rem",
                mt: 2,
                backgroundColor: darkMode ? "rgba(60, 60, 60, 0.6)" : "rgba(220, 220, 220, 0.6)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "0.875rem",
                mt: 1,
                backgroundColor: darkMode ? "rgba(60, 60, 60, 0.6)" : "rgba(220, 220, 220, 0.6)",
              }}
            />
          </div>
        ))}
      </div>
    ) : (
      <div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-4 p-3 border rounded-lg">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              sx={{
                backgroundColor: darkMode ? "rgba(50, 50, 50, 0.6)" : "rgba(200, 200, 200, 0.6)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "1.5rem",
                mt: 2,
                backgroundColor: darkMode ? "rgba(60, 60, 60, 0.6)" : "rgba(220, 220, 220, 0.6)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "1rem",
                mt: 1,
                backgroundColor: darkMode ? "rgba(60, 60, 60, 0.6)" : "rgba(220, 220, 220, 0.6)",
              }}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "0.875rem",
                mt: 1,
                backgroundColor: darkMode ? "rgba(60, 60, 60, 0.6)" : "rgba(220, 220, 220, 0.6)",
              }}
            />
          </div>
        ))}
      </div>
    );
  };



  return (
    <div className="pt-20 px-[3%] lg:px-[6%]">
      <HeadeFilters layout={layout} setLayout={setLayout} />
      <div className="grid mt-5 lg:grid-cols-4 gap-x-14">
        <div className="top-0 row-start-3 lg:col-span-1 lg:row-start-auto h-fit lg:sticky">
          <div
            className={`filter-modal ${isFilterMenuOpen && "open"}`}
            onClick={handleCloseFiltermenu}
          >
            <div className={`filter-dialog ${isFilterMenuOpen && "open"}`}>
              <div className="border-b flex-center-between dark:border-dark lg:hidden">
                <div
                  className="icon-box lg:hidden"
                  onClick={() => dispatch(closeFilterMenu())}
                >
                  <FiDelete />
                </div>
                <p className="uppercase">Filters</p>
              </div>
              <AdvancedSearch />
              <Type />
              <PriceRange />
              <SocialIcons />
              <CTA />
            </div>
          </div>
        </div>
        <div className="top-0 mt-5 lg:col-span-3 lg:mt-0 h-fit lg:sticky">
          {filterPropertyLoading ? (
            renderSkeleton()
          ) : properties && properties.length > 0 ? (
            layout === "grid" ? (
              <PropertyList properties={properties} />
            ) : (
              <PropertyFullWidth properties={properties} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-10">
              <img
                src={noResult}
                alt="No Results Found"
                style={{ width: '300px', maxWidth: '100%' }}
              />
              <CustomText variant="h6" color="textSecondary" className="mt-4">
                Oops! No properties match your search.
              </CustomText>
              <CustomText variant="body1" color="textSecondary">
                Try adjusting your filters or search criteria.
              </CustomText>
              <CommonButton sx={{mt:2}} onClick={()=>dispatch(propertyFilterListApi())}>Clear Search</CommonButton>
            </div>
          )}
          {properties && properties.length > 0 ? (<Pagination rowsPerPage={rowsPerPage} currentPage={currentPage} totalPages={totalPages} totalDocuments={totalDocuments} onPageChange={handlePageChange} />) : null}
        </div>
      </div>
    </div>
  );
};

export default PropertySix;
