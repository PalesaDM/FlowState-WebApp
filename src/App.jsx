import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Locations from "./pages/Locations";
import RoutesPage from "./pages/Routes";
import Calendar from "./pages/Calendar";

import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/calendar" element={<Calendar />} />
      </Routes>
    </BrowserRouter>
  );
}