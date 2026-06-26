import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
      <Link to="/" className="text-xl font-bold tracking-tight">
        E-Auction
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="hover:text-amber-400 transition-colors">
          Browse
        </Link>

        {user ? (
          <>
            <Link
              to="/create-auction"
              className="hover:text-amber-400 transition-colors"
            >
              Sell an Item
            </Link>

            <Link
              to="/my-auctions"
              className="hover:text-amber-400 transition-colors"
            >
              My Auctions
            </Link>

            <span className="text-sm text-slate-400">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="bg-amber-500 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-400 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-amber-400 transition-colors"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="bg-amber-500 text-slate-900 px-4 py-2 rounded-md font-medium hover:bg-amber-400 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;