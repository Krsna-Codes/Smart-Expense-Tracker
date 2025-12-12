// src/pages/Login.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api"
import pattern from "../assets/graphic.jpg"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const res = await api.post("/auth/login", form)
      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed")
    }
  }

  return (
    <div className="min-h-screen bg-[#2b2f36] flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl flex">
        <div className="w-full md:w-2/3 bg-[#1f2226] p-10 md:p-14">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-extrabold text-white mb-2">Welcome back
               <span className="ml-1 inline-block w-2 h-2 bg-[#39a7ff] rounded-full align-middle" />
            </h1>
            
            <p className="text-sm text-zinc-400 mb-8">Sign in to continue to your account</p>

            {error && <div className="mb-4 text-sm text-red-400 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-2 block">Password</label>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#222427] border border-transparent text-white
                             focus:outline-none focus:ring-2 focus:ring-[#2fa6ff] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 px-6 py-3 rounded-full bg-[#2aa6ff] text-white font-semibold shadow-md
                           hover:brightness-95 transition"
              >
                Log in
              </button>
            </form>

            <p className="text-sm text-zinc-400 mt-6 text-center">
              Don't have an account?{" "}
              <button onClick={() => navigate("/register")} className="text-[#4fb3ff] hover:underline">
                Create account
              </button>
            </p>
          </div>
        </div>

        <div className="hidden md:block md:w-1/3 relative overflow-hidden" aria-hidden="true">
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
  )
}
