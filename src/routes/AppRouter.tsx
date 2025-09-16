import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "../components";
import { NotFound, LoginPage } from "../pages";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />
        <Route
          path="/login"
          element={
            <AnimatedBackground>
              <LoginPage />
            </AnimatedBackground>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
