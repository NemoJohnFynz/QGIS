// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/nainLayout";
import { AppContextProvider } from "../context/AppContextProvider";
import Home from "../pages/Home/Home";
import LayoutAdmin from "../pages/admin/layoutAdmin";
import Locations from "../pages/admin/Locations";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";

// import { Dashboard } from "@mui/icons-material";
const AppRouter = () => {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          {/* Add more routes if needed */}
          <Route path="/admin" element={<LayoutAdmin />}>
            <Route index element={<Dashboard />} />
            <Route path="locations" element={<Locations />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
            {/* Add more routes if needed */}
          </Route>
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Router>
    </AppContextProvider>
  );
};

export default AppRouter;
