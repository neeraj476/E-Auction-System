import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import { registerUser } from "../services/authApi";
const Register = () => {
  const [name, setName] = useState("");
  const { fetchUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const {login} = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!name || !email || !password || !confirmPassword) {
      setFormError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

     const data =  await registerUser(name,email,password);
      await fetchUser();

    console.log({
      data
    });

    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">
          Create an account
        </h1>

        <p className="text-slate-500 text-sm mb-6">
          Start bidding and selling on E-Auction.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
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
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Re-enter your password"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-500">
              {formError}
            </p>
          )}

          <button
            type="submit"
            className="bg-amber-500 text-slate-900 font-semibold py-2 rounded-md hover:bg-amber-400 transition-colors"
          >
            Create Account
          </button>
        </form>

        <p className="text-sm text-slate-500 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;