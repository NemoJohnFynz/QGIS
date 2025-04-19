// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/nainLayout";
import { AppContextProvider } from "../context/AppContextProvider";
import Home from "../pages/Home/Home";
const AppRouter = () => {
  return (
    <AppContextProvider>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
          </Route>
          {/* Add more routes if needed */}
        </Routes>
      </Router>
    </AppContextProvider>
  );
};

export default AppRouter;
