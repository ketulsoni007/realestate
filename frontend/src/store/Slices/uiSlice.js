import { createSlice } from "@reduxjs/toolkit";
import { navLinks } from "../../data/navLinks";

const initialState = {
  isDropdownOpen: false,
  position: null,
  currentLink: {},
  isSidebarOpen: false,
  isFilterMenuOpen: false,
  darkMode: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openDropdown: (state, action) => {
      const mainLink = action.payload.link;
      state.currentLink = navLinks.find((link) => link.linkText === mainLink);
      state.isDropdownOpen = true;
      state.position = action.payload.center;
    },
    closeDropdown: (state) => {
      state.isDropdownOpen = false;
    },
    toggleDropdown: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen;
    },

    openSidebar: (state) => {
      state.isSidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.isSidebarOpen = false;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openFilterMenu: (state) => {
      state.isFilterMenuOpen = true;
    },
    closeFilterMenu: (state) => {
      state.isFilterMenuOpen = false;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});


export const { openDropdown, closeDropdown, toggleDropdown, openSidebar, closeSidebar, toggleSidebar, openFilterMenu, closeFilterMenu, toggleDarkMode } = uiSlice.actions;

export default uiSlice.reducer;