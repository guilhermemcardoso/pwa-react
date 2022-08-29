import { lazy } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import { ProtectedRoute } from "./protectedRoute";
const Dashboard = lazy(() => import("../pages/Dashboard"));
const SignIn = lazy(() => import("../pages/SignIn"));

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
