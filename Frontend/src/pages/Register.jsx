import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeadphones } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
      email: "",
      password: "",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.email ||
      !formData.password
    ) {
      return toast.error("Please fill all fields");
    }

    try {
      await api.post(
        "/auth/register",
        formData
      );

      toast.success("Account created");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-emerald-950 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900/90 border border-zinc-800 p-8 rounded-xl w-[90%] max-w-md shadow-2xl"
      >
        <div className="flex flex-col items-center mb-7">
          <div className="h-14 w-14 rounded-full bg-green-500 text-black flex items-center justify-center mb-4">
            <FaHeadphones className="text-2xl" />
          </div>

          <h1 className="text-white text-3xl font-bold">
            Create account
          </h1>

          <p className="text-gray-400 text-sm mt-2 text-center">
            Join Audionyx and start listening.
          </p>
        </div>

        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          className="w-full p-3 rounded mb-3 bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
          onChange={(e) =>
            setFormData({
              ...formData,
              username:
                e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          className="w-full p-3 rounded mb-3 bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
          onChange={(e) =>
            setFormData({
              ...formData,
              email:
                e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          className="w-full p-3 rounded mb-5 bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-green-500"
          onChange={(e) =>
            setFormData({
              ...formData,
              password:
                e.target.value,
            })
          }
        />

        <button
          className="cursor-pointer w-full bg-green-500 hover:bg-green-400 p-3 rounded-full text-black font-bold"
        >
          Register
        </button>

        <p className="text-gray-400 text-center mt-5">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 hover:text-green-400 font-semibold"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
