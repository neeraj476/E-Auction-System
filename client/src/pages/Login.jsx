import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { fetchUser } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");
    setError("");

    if (!email || !password) {
      setFormError("Email and password are required");
      return;
    }

    

    try {
      setLoading(true);
      // console.log(email,password);

      const response = await loginUser(email, password);
      login(response.user);
      await fetchUser();

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>

        <p className="text-slate-500 text-sm mb-6">
          Log in to bid or manage your listings.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Your password"
            />
          </div>

          {(formError || error) && (
            <p className="text-sm text-red-500">{formError || error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 text-slate-900 font-semibold py-2 rounded-md hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-amber-600 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
