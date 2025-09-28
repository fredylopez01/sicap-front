import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "../components";
import { NotFound, LoginPage, Unauthorized, LandingPage, AddUserForm } from "../pages";
import { PrivateRoute } from "./PrivateRoute";
import { AddBranchForm } from "../pages/branches/AddBranchForm";
import { BranchProvider } from "../context/BranchContext";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <AnimatedBackground>
              <LoginPage />
            </AnimatedBackground>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div>Dashboard.....</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <div>Solo para el admnistrador.....</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-branch"
          element={
            <BranchProvider>
              <AnimatedBackground>
                <AddBranchForm />
              </AnimatedBackground>
            </BranchProvider>
          }
        />
        <Route
          path="/add-user"
          element={
            //<PrivateRoute requiredRole="admin">
            <AnimatedBackground>
              <AddUserForm />
            </AnimatedBackground>
            //</PrivateRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
