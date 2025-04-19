import React, { createContext, useContext, useState } from "react";
const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
  return (
    <ComponentContext.Provider value={{  }}>
      {children}
    </ComponentContext.Provider>
  );
};

export const useComponent = () => useContext(ComponentContext);
