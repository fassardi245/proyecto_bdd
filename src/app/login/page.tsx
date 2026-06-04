"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (isLoggedIn === "true") {
      router.push("/dashboard")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Respuesta API:", data, "Status:", res.status)

      if (!res.ok) {
        setError(data.error || "Credenciales inválidas")
        setLoading(false)
        return
      }

      localStorage.setItem("isLoggedIn", "true")

      router.push("/dashboard")
    } catch (err) {
      console.error("Error fetch:", err)
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-orange-200 via-white to-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center"
      >
        <img
          src="https://marketplace.canva.com/EAFFfe8wv68/2/0/1600w/canva-logotipo-gimnasio-moderno-minimalista-naranja-Gah3oVF_OxE.jpg"
          alt="Logo Gimnasio"
          className="w-24 h-24 mb-6 rounded-full shadow-md"
        />

        <h1 className="text-2xl font-bold mb-6 text-gray-800">Iniciar sesión</h1>

        {error && (
          <p role="alert" className="text-red-500 mb-4 font-medium">
            {error}
          </p>
        )}

        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />

        <input
          id="password"
          name="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border-2 border-gray-300 rounded-lg text-gray-800 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  )
}
