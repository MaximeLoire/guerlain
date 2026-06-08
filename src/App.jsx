import { Routes, Route } from "react-router-dom";
import GlobeHome from "./pages/GlobeHome.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobeHome />} />
      <Route path="/:region" element={<CollectionPage />} />
    </Routes>
  );
}
