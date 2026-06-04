"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [authChecked, setAuthChecked] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem("isLoggedIn") === "true";
    setLoggedIn(isLogged);
    setAuthChecked(true);

    if (!isLogged && pathname.startsWith("/dashboard")) {
      router.replace("/");
    }
  }, [router, pathname]);

  if (!authChecked) return null;

  const navItems = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Planes", href: "/dashboard/planes" },
    { label: "Socios", href: "/dashboard/socios" },
    { label: "Pagos", href: "/dashboard/pagos" },
    { label: "Rutinas", href: "/dashboard/rutinas" }, 
    { label: "Asistencias", href: "/dashboard/asistencias" }, 
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

  return (
    <div className="min-h-screen bg-white">
      
      <header className="w-full shadow-sm">
        <div className="flex w-full h-16">
         
          <div className="flex items-stretch bg-black">
           
            <div
              className="flex items-center justify-center w-24 select-none cursor-pointer"
              onClick={() => router.push("/dashboard")} 
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center text-white font-bold transition-transform hover:scale-105">
                GYM
              </div>
            </div>


            <nav className="flex items-stretch">
              {navItems.map((item) => (
                <div
                  key={item.href}
                  onClick={() => router.push(item.href)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`px-6 flex-1 flex items-center justify-center text-white font-semibold text-sm transition ${
                    isActive(item.href)
                      ? "bg-neutral-900 border-b-4 border-orange-400"
                      : "bg-black hover:bg-neutral-800/90"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          <div
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-400"
            title="Panel central"
          />

          <div className="flex items-stretch bg-black">
            <div
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                setLoggedIn(false);
                router.replace("/");
              }}
              className="px-6 flex-1 flex items-center justify-center text-white font-semibold text-sm bg-red-500 hover:bg-red-600 transition"
              style={{ cursor: "pointer" }}
            >
              Logout
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
