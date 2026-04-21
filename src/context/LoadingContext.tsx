"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const SESSION_KEY = "rs-loaded";

interface LoadingContextType {
  isLoading: boolean;
  markLoadingDone: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  markLoadingDone: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  // Start as true; will flip to false immediately if session flag is already set
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alreadyShown =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) !== null;

    if (alreadyShown) {
      setIsLoading(false);
    }
  }, []);

  const markLoadingDone = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(SESSION_KEY, "1");
    }
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, markLoadingDone }}>
      {children}
    </LoadingContext.Provider>
  );
}
