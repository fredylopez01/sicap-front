import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "../components";
import { NotFound, LoginPage, Unauthorized, LandingPage } from "../pages";
import { PrivateRoute } from "./PrivateRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import Sedes from "@/pages/dashboard/Sedes";
import SedeForm from "@/pages/dashboard/forms/SedeForm"
import SedePage from "@/pages/dashboard/SedePage";


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
          path="/dashboard/"
          element={
            <Dashboard>
              <div>Bienvenido al dashboard</div>
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/sedes"
          element={
            <Dashboard>
              <Sedes />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/sedes/new"
          element={
            <Dashboard>
              <SedeForm />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard/sedes/:id"
          element={
            <Dashboard>
              <SedePage />
            </Dashboard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard>
              <div>🏠 Bienvenido al dashboard</div>
            </Dashboard>
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
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
