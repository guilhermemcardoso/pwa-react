import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/authContext";
import { ProtectedRoute } from "./protectedRoute";
import Main from "../pages/Main";
import SignIn from "../pages/SignIn";

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/main/*"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default Router;
