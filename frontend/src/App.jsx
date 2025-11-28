import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";
import { GlobalContext } from "./context/GlobalContext";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import { useContext } from "react";

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(GlobalContext);
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// };

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <Dashboard />
            // <ProtectedRoute>

            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
