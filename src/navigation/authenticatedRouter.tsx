import { Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Materials from "../pages/Materials";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Unities from "../pages/Unities";

function AuthenticatedRouter() {
  return (
    <div>
      <Outlet />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="materials" element={<Materials />} />
        <Route path="unities" element={<Unities />} />
        <Route path="orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default AuthenticatedRouter;
