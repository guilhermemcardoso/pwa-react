import { Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Materials from "../pages/Materials";
import Unities from "../pages/Unities";
import Products from "../pages/Products";

function AuthenticatedRouter() {
  return (
    <div>
      <Outlet />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="materials" element={<Materials />} />
        <Route path="unities" element={<Unities />} />
      </Routes>
    </div>
  );
}

export default AuthenticatedRouter;
