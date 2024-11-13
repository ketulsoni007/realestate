/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { FiDelete, FiMoon, FiSun } from "react-icons/fi";
import { BiSearch, BiMenu, BiUser, BiBuildingHouse } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { persistor } from "../../store";
import { closeDropdown, closeSidebar, openSidebar, toggleDarkMode } from "../../store/Slices/uiSlice";
import { navLinks } from "../../data/navLinks";
import SingleLink from "./SingleLink";
import { Avatar, Backdrop, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Paper, Tooltip, Typography } from "@mui/material";
import config from "../../config/config";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import { authLogoutApi } from "../../store/Slices/authSlice";
import { CustomDivider, CustomText } from "../fields/field";
import { PropertySearchListReset, PropertySearchText, propertySearchListApi } from "store/Slices/propertySlice";
import useWindowWidth from "hooks/windowWidth";

const Navbar = () => {
  const width = useWindowWidth();
  const rootDoc = document.querySelector(":root");
  const { darkMode, isSidebarOpen } = useSelector((state) => state.ui);
  const user = useSelector((state) => state.auth.user);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const isPropertySearchList = useSelector((state) => state.property.isPropertySearchList);
  const isSearchFilterText = useSelector((state) => state.property.isSearchFilterText);


  const handleClickAccount = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAcoount = () => {
    setAnchorEl(null);
  };

  // Dark mode toggle
  const handleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  // Store darkmode value to localStorage;
  useEffect(() => {
    if (darkMode) rootDoc.classList.add("dark");
    else rootDoc.classList.remove("dark");
    // localStorage.setItem("Martvilla-theme-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleClose = (e) => {
    if (!e.target.classList.contains("link")) {
      dispatch(closeDropdown());
    }
  };

  const handleCloseSidebar = (e) => {
    if (e.target.classList.contains("mobile-modal")) dispatch(closeSidebar());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search");
  };

  return (
    <div className="navbar h-[45px] fixed w-full z-20 top-0 left-0 px-[2%]  md:px-[6%] flex-center-between py-[0.35rem] bg-white/60 border-b backdrop-blur-sm dark:border-dark dark:bg-card-dark/60" onMouseOver={handleClose}>
      <Link to="/" className="flex-shrink-0 flex-align-center gap-x-1">
        <BiBuildingHouse className="text-3xl text-primary" />
        <h1 className="hidden md:block">MartVilla</h1>
      </Link>

      <div className="flex-align-center gap-x-4">
        {/*-------------------------------------- Desktop Menu------------------------------------- */}
        <ul className={`hidden md:flex-align-center ${showSearchBar && "!hidden"}`}>
          {navLinks.map((link) => (
            <SingleLink {...link} key={link.id} />
          ))}
        </ul>

        {/*---------------------------------------- Mobile Menu------------------------------------- */}
        <div className={`lg:hidden mobile-modal fixed w-screen h-screen top-0 left-0 bg-black/50 z-50 opacity-0 pointer-events-none transition-a  ${isSidebarOpen && "open"}`} onClick={handleCloseSidebar}>
          <ul className={`mobile-dialog overflow-auto absolute flex flex-col space-y-4 p-3 bg-white dark:bg-card-dark h-screen max-w-[300px] w-full -translate-x-[500px] transition-a ${isSidebarOpen && "open"}`}>
            <div className="border-b flex-center-between dark:border-slate-800">
              <p className="uppercase">menu</p>
              <div className="icon-box md:hidden" onClick={() => dispatch(closeSidebar())}>
                <FiDelete />
              </div>
            </div>
            {navLinks?.map(({ id, linkText, url, subLinks }) => (
              <ul key={id}>
                <NavLink to={url} end className="w-fit before:!hidden" onClick={() => dispatch(closeSidebar())}>
                  {linkText}
                </NavLink>
                {subLinks?.map(({ id, linkText, url }) => (
                  <ul key={id} className="mt-2">
                    <NavLink to={url} end className="relative ml-8 text-sm before:hidden w-fit after:absolute after:w-2 after:h-2 after:rounded-full after:border-2 after:top-1/2 after:-translate-y-1/2 after:-left-4 dark:after:opacity-50" onClick={() => dispatch(closeSidebar())}>
                      {linkText}
                    </NavLink>
                  </ul>
                ))}
              </ul>
            ))}
          </ul>
        </div>

        <div className="space-x-2 flex-align-center">
          {/*----------------------------- search Bar----------------------------------------------------- */}
          {/* <form onSubmit={handleSubmit}>
            
          </form> */}
          <div className={'relative'}>
            <div className={`flex-align-center h-9 w-9 transition-a  border-slate-300 dark:border-dark rounded-full ${showSearchBar && "!w-[150px] md:!w-[200px] border bg-transparent text-inherit"}`}>
              <input type="search" value={isSearchFilterText} className={`outline-none border-none h-0 w-0 bg-transparent ${showSearchBar && "!w-full !h-full px-4"}`} placeholder="search..." onChange={(e) => {
                const SearchKeyWords = e?.target?.value;
                dispatch(PropertySearchText(SearchKeyWords))
                dispatch(propertySearchListApi({ keyword: SearchKeyWords }))
              }} />
              <span className={`grid flex-shrink-0 rounded-full w-9 h-9 place-items-center text-white bg-primary sm:cursor-pointer ${showSearchBar && "bg-transparent hover:bg-slate-100 text-inherit sm:cursor-pointer dark:hover:bg-hover-color-dark"}`} onClick={() => {
                dispatch(PropertySearchText(''))
                setShowSearchBar(!showSearchBar)
                dispatch(PropertySearchListReset())
              }}>
                <BiSearch className="text-muted" />
              </span>
            </div>
            {showSearchBar && isPropertySearchList?.length > 0 && (
              <>
                <div className="absolute " style={{ bottom: '-228px', left: width < 900 ? -31 : 0, background: `${darkMode ? 'rgb(53 57 73)' : 'rgb(255 255 255)'}`, minWidth: '320px', maxWidth: '320px', padding: '8px', minHeight: '220px', maxHeight: '220px', overflow: 'auto', boxShadow: "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)" }}>
                  {isPropertySearchList.map((item, index) => {
                    const imageLinks = item?.images && item?.images.length > 0 ? `${config.IMAGE_URL}/property/${item.images[0].image}` : '';
                    const title = item?.title;
                    return (
                      <MenuItem onClick={() => {
                        dispatch(PropertySearchText(''))
                        setShowSearchBar(!showSearchBar)
                        dispatch(PropertySearchListReset())
                        navigate(`/property/${item?._id}`)
                      }}>
                        <Avatar src={imageLinks} sx={{ mr: 1 }} /> <Typography sx={{ color: darkMode ? '#FFF' : '#131313' }}>{title?.length > 21 ? `${title.slice(0, 21)}...` : title}</Typography>
                      </MenuItem>
                    )
                  })}
                </div>
                <Backdrop
                  open={showSearchBar && isPropertySearchList?.length > 0}
                  sx={{ backgroundColor: 'transparent' }}
                  onClick={() => {
                    dispatch(PropertySearchText(''));
                    setShowSearchBar(!showSearchBar);
                    dispatch(PropertySearchListReset());
                  }}
                />
              </>
            )}
          </div>

          {/*----------------------------- Dark mode toggle-------------------------------------------------- */}
          <div className="bg-white shadow-md icon-box dark:bg-dark-light hover:shadow-lg hover:bg-transparent" onClick={handleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />}
          </div>
          {/*----------------------------- Profile Icon-------------------------------------------------- */}
          {/* {user?.profile_picture ? (
            <Avatar component={Paper} elevation={2} sx={{ width:'36px',height:'36px',objectFit:'cover' }} src={`${config?.IMAGE_URL}/user/${user?.profile_picture}`} />
          ) : (
            <div className="bg-white shadow-md icon-box dark:bg-dark-light hover:shadow-lg hover:bg-transparent">
              <BiUser />
            </div>
          )} */}
          {user ? (
            <React.Fragment>
              <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleClickAccount} size="small" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined}>
                    {/* Conditional rendering for Avatar */}
                    {user?.profile_picture ? (
                      <Avatar component={Paper} elevation={2} sx={{ width: 36, height: 36, objectFit: "cover" }} src={`${config.IMAGE_URL}/user/${user?.profile_picture}`} />
                    ) : (
                      <div className="bg-white shadow-md icon-box dark:bg-dark-light hover:shadow-lg hover:bg-transparent">
                        <BiUser size={32} /> {/* Adjust icon size */}
                      </div>
                    )}
                  </IconButton>
                </Tooltip>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseAcoount}
                onClick={handleCloseAcoount}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      bgcolor: darkMode ? "grey.900" : "background.paper", // Conditionally apply dark mode background
                      color: darkMode ? "grey.300" : "text.primary", // Change text color for dark mode
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: darkMode ? "grey.900" : "background.paper", // Apply dark mode to arrow
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
                <MenuItem onClick={()=>{
                  navigate('/profile');
                  setAnchorEl(null);
                }}>
                  <Avatar src={`${config.IMAGE_URL}/user/${user?.profile_picture}`} /> Profile
                </MenuItem>
                <MenuItem onClick={handleCloseAcoount}>
                  <Avatar /> My account
                </MenuItem>
                <CustomDivider />
                <MenuItem onClick={handleCloseAcoount}>
                  <ListItemIcon>
                    <Settings fontSize="small" sx={{ color: darkMode ? '#FFF' : 'inherit' }} />
                  </ListItemIcon>
                  Settings
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(authLogoutApi({})).then((action) => {
                      persistor.purge();
                      navigate('/signin');
                    });
                  }}>
                  <ListItemIcon>
                    <Logout sx={{ color: darkMode ? '#FFF' : 'inherit' }} fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            <div className="bg-white shadow-md icon-box dark:bg-dark-light hover:shadow-lg hover:bg-transparent" onClick={() => navigate('/signin')}>
              <BiUser />
            </div>
          )}

          {/*------------------------------- Mobile Menu Toogle------------------------- */}
          <div className="icon-box md:hidden" onClick={() => dispatch(openSidebar())}>
            <BiMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
