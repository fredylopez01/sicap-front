import { AuthProvider } from "./context/AuthContext";
import { ParkingProvider } from "./context/ParkingContext";
import { AppRouter } from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <AppRouter />
      </ParkingProvider>
    </AuthProvider>
  );
}

export default App;
