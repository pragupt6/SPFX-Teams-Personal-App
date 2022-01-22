import React, { useState, useEffect, createContext } from 'react';

const AppContext = createContext(undefined);
export const AppContextProvider = ({ children }) => {
    const color = 'grey';
    return (
        <AppContext.Provider value={{ color }}>
            {children}
        </AppContext.Provider>

    );
};
export default AppContext;