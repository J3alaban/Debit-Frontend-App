import { createContext, useState, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );

  const setToken = (token: string | null) => {
    setTokenState(token);

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
