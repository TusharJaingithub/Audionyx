import AppRoutes from "./routes/AppRoutes";
import MusicPlayer from "./components/MusicPlayer";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#18181b",
            color: "#fff",
            border: "1px solid #27272a",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#18181b",
            },
          },
        }}
      />

      <AppRoutes />

      {user && (
        <MusicPlayer />
      )}
    </>
  );
}

export default App;
