import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "../components";
import {
  NotFound,
  LoginPage,
  Unauthorized,
  LandingPage,
  AddUserForm,
} from "../pages";
import { PrivateRoute } from "./PrivateRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import Sedes from "@/pages/dashboard/Sedes";
import SedeForm from "@/pages/dashboard/forms/SedeForm";
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
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<div>🏠 Bienvenido al dashboard</div>} />
          <Route path="sedes" element={<Sedes />} />
          <Route path="sedes/new" element={<SedeForm />} />
          <Route path="sedes/:id" element={<SedePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="/admin"
          element={
            <PrivateRoute requiredRole="admin">
              <div>Solo para el admnistrador.....</div>
            </PrivateRoute>
          }
        />
        <Route path="/add-user" element={<AddUserForm />} />

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
