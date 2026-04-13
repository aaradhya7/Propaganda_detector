import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  return (
    <AppContext.Provider value={{ result, setResult, loading, setLoading, history, setHistory }}>
      {children}
    </AppContext.Provider>
  );
};