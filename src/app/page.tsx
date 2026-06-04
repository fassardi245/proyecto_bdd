"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      router.push("/dashboard"); 
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-500 text-center text-white">
      <h1 className="text-4xl font-extrabold mb-8">¡Bienvenido!</h1>

      <img
        src="https://marketplace.canva.com/EAFFfe8wv68/2/0/1600w/canva-logotipo-gimnasio-moderno-minimalista-naranja-Gah3oVF_OxE.jpg"
        alt="Logo GYM"
        className="w-40 h-40 mb-6 rounded-full shadow-lg border-4 border-white"
      />

      <p className="text-xl mb-8 font-medium">
        Para poder visualizar el dashboard, por favor inicie sesión
      </p>

      <button
        onClick={() => router.push("/login")}
        className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-2xl shadow-md hover:bg-orange-200 hover:scale-105 transition-all duration-200"
      >
        Log In
      </button>
    </div>
  );
}
