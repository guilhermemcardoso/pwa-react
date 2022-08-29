import { User } from "firebase/auth";
import { createContext, ReactNode, useContext, useState } from "react";
import { firebaseSignIn, firebaseSignOut } from "../utils/firebase/auth";
import { useLocalStorage } from "./localStorageContext";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  authLoading: boolean;
  user: User | undefined;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authLoading, setAuthLoading] = useState(false);
  const [user, setUser] = useLocalStorage("user", undefined);

  async function signIn(email: string, password: string) {
    setAuthLoading(true);
    const user = await firebaseSignIn(email, password);
    if (user) {
      setAuthLoading(false);
      setUser(user);
      return true;
    }

    setAuthLoading(false);
    return false;
  }

  async function signOut() {
    const response = await firebaseSignOut();
    if (response) {
      setUser(undefined);
    }
    return response;
  }

  return (
    <AuthContext.Provider
      value={{
        authLoading,
        user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
