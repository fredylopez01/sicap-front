import "./App.css";
import { AnimatedBackground } from "./components";
import LoginPage from "./pages/auth/Login";

function App() {
  return (
    <AnimatedBackground>
      <LoginPage />
    </AnimatedBackground>
  );
}

export default App;
