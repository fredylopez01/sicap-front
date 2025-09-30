import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnimatedBackground } from "../components";
import {
  NotFound,
  LoginPage,
  Unauthorized,
  LandingPage,
  AddUserForm,
  UsersList,
} from "../pages";
import { PrivateRoute } from "./PrivateRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import Sedes from "@/pages/dashboard/Sedes";
import SedeForm from "@/pages/dashboard/forms/SedeForm";
import SedePage from "@/pages/dashboard/SedePage";
import DashboardOverview from "@/pages/dashboard/home/DashboardOverview";

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
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path="" element={<DashboardOverview />} />
          <Route
            path="sedes"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <Sedes />
              </PrivateRoute>
            }
          />
          <Route
            path="sedes/new"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <SedeForm />
              </PrivateRoute>
            }
          />
          <Route
            path="sedes/:id"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <SedePage />
              </PrivateRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route
            path="usuarios/new"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <AddUserForm />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
