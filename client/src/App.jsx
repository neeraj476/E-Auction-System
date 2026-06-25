import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AuctionDetails from "./pages/AuctionDetails.jsx";
import CreateAuction from "./pages/CreateAuction.jsx";
import MyAuctions from "./pages/MyAuctions.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {

  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auctions/:id" element={<AuctionDetails />} />
        <Route
          path="/create-auction"
          element={
            <ProtectedRoute>
            <CreateAuction />
             </ProtectedRoute>
          }
        />
        <Route
          path="/my-auctions"
          element={
            <ProtectedRoute>
            <MyAuctions />
             </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
