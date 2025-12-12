// src/pages/Register.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import pattern from "../assets/graphic.jpg" // replace with your image (webp preferred)

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post("/auth/register", form)
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#2b2f36] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex">
        {/* Left (form) */}
        <div className="w-full md:w-2/3 bg-[#1f2226] p-10 md:p-14">
          <div className="max-w-lg mx-auto">
            <div className="mb-8">
              <span className="text-sm text-zinc-400 uppercase"></span>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-white">
                Create new account
                <span className="ml-1 inline-block w-2 h-2 bg-[#39a7ff] rounded-full align-middle" />
              </h1>
              <p className="mt-2 text-sm text-zinc-400">
                Already a Member?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-[#4fb3ff] hover:underline"
                >
                  Log In
                </button>
              </p>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-400 text-center">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-zinc-400 mb-2 block">First name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#222427] border border-transparent text-white
                               focus:outline-none focus:ring-2 focus:ring-[#2fa6ff] transition"
                    placeholder="Michal"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-zinc-400 mb-2 block">Last name</label>
                  <input
                    name="last"
                    onChange={() => {}}
                    className="w-full px-4 py-3 rounded-xl bg-[#222427] border border-transparent text-white
                               focus:outline-none focus:ring-2 focus:ring-[#2fa6ff] transition"
                    placeholder="Masiak"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222427] border border-transparent text-white
                             focus:outline-none focus:ring-2 focus:ring-[#2fa6ff] transition"
                  placeholder="you@company.co"
                />
              </div>

              {/* Password */}
              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#222427] border border-transparent text-white
                               focus:outline-none focus:ring-2 focus:ring-[#2fa6ff] transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"
                    aria-hidden
                  >
                    {/* optional eye icon */}
                     
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 items-center mt-4">


                <button
                  type="submit"
                  className="ml-auto px-17 py-3 rounded-full bg-[#2aa6ff] text-white font-semibold shadow-md
                             hover:brightness-95 transition"
                >
                  Create account
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right (image / visual) */}
        <div
          className="hidden md:block md:w-1/3 relative bg-[linear-gradient(0deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08))] overflow-hidden"
          aria-hidden="true"
        >
          {/* subtle overlay background using the provided image scaled/centered */}
          <div className="absolute inset-0">
            <img
              src={pattern}
              alt=""
              className="h-full w-full object-cover opacity-90"
              loading="lazy"
              style={{ filter: "brightness(0.45) contrast(0.9)" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
