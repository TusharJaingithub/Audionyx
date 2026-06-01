import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      return toast.error("Please fill all fields");
    }

    try {
      setLoading(true);

      const data = await loginUser({
        username: formData.identifier,
        email: formData.identifier,
        password: formData.password,
        remember,
      });

      login(data.user);
      toast.success("Welcome back");

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-950 to-emerald-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-800 p-8 rounded-xl w-[90%] max-w-md shadow-2xl"
      >
        <div className="flex flex-col items-center mb-7">
          <div className="h-14 w-14 rounded-full bg-green-500 text-black flex items-center justify-center mb-4">
            <FaHeadphones className="text-2xl" />
          </div>

          <h1 className="text-white text-3xl font-bold">
            Login to Audionyx
          </h1>

          <p className="text-gray-400 text-sm mt-2 text-center">
            Continue listening to your music.
          </p>
        </div>

        <input
          type="text"
          placeholder="Username or email"
          value={formData.identifier}
          onChange={(e) =>
            setFormData({
              ...formData,
              identifier: e.target.value,
            })
          }
          className="w-full p-3 mb-4 rounded bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value,
            })
          }
          className="w-full p-3 mb-5 rounded bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
        />

        <label className="flex items-center gap-2 text-sm text-gray-300 mb-4">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Remember me</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer w-full bg-green-500 hover:bg-green-400 py-3 rounded-full text-black font-bold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-gray-400 text-center mt-5">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-500 hover:text-green-400 font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
