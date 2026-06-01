import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useLocation,
  useNavigate,
  useNavigationType,
} from "react-router-dom";

export const RouteHistoryContext = createContext(null);

export function RouteHistoryProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const [history, setHistory] = useState([
    location.pathname + location.search,
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const initialMount = useRef(true);

  useEffect(() => {
    const path = location.pathname + location.search;

    if (initialMount.current) {
      initialMount.current = false;
      setHistory([path]);
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      return;
    }

    if (navigationType === "PUSH") {
      setHistory((prev) => {
        const next = [...prev.slice(0, currentIndexRef.current + 1), path];
        currentIndexRef.current = next.length - 1;
        setCurrentIndex(currentIndexRef.current);
        return next;
      });
    } else if (navigationType === "POP") {
      setHistory((prev) => {
        const existingIndex = prev.lastIndexOf(path);
        if (existingIndex !== -1) {
          currentIndexRef.current = existingIndex;
          setCurrentIndex(existingIndex);
          return prev;
        }

        const next = [...prev.slice(0, currentIndexRef.current + 1), path];
        currentIndexRef.current = next.length - 1;
        setCurrentIndex(currentIndexRef.current);
        return next;
      });
    } else if (navigationType === "REPLACE") {
      setHistory((prev) => {
        const next = [...prev];
        next[currentIndexRef.current] = path;
        return next;
      });
    }
  }, [location, navigationType]);

  const goBack = () => {
    if (currentIndexRef.current > 0) {
      navigate(-1);
    }
  };

  const goForward = () => {
    if (currentIndexRef.current < history.length - 1) {
      navigate(1);
    }
  };

  const value = useMemo(
    () => ({
      history,
      currentIndex,
      canGoBack: currentIndex > 0,
      canGoForward: currentIndex < history.length - 1,
      goBack,
      goForward,
    }),
    [history, currentIndex]
  );

  return (
    <RouteHistoryContext.Provider value={value}>
      {children}
    </RouteHistoryContext.Provider>
  );
}

export function useRouteHistory() {
  const context = useContext(RouteHistoryContext);

  if (!context) {
    throw new Error(
      "useRouteHistory must be used within a RouteHistoryProvider"
    );
  }

  return context;
}
