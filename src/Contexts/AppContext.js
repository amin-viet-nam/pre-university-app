import React from 'react';

export const AppContext = React.createContext({
    loading: false,
    setLoading: () => {}
});