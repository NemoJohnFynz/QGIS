// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "../layout/nainLayout";
import { AppContextProvider } from "../context/AppContextProvider";
const AppRouter = () => {
  return (
    <Router>
      <AppContextProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Add more routes if needed */}
          </Route>
        </Routes>
      </AppContextProvider>
    </Router>
  );
};

export default AppRouter;
