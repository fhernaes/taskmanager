"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const { data: session, status } = useSession();

  // Estado inicial: asumimos que no hay sesión hasta que se demuestre lo contrario
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    // Cuando la sesión está cargada, actualizamos el estado
    if (status !== "loading") {
      setHasSession(!!session?.user);
    }
  }, [status, session?.user]);

  if (status === "loading") {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">
          <div className="skeleton-navbar-brand"></div>
          <div className="skeleton-navbar-links"></div>
        </div>
      </nav>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const renderAuthLinks = () => {
    // Si hay sesión mostramos los botones de dashboard y logout
    if (hasSession) {
      return (
        <>
          <li className="nav-item">
            <Link href="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <button
              onClick={handleLogout}
              className="btn btn-outline-light"
              style={{ textDecoration: "none" }}
            >
              Logout
            </button>
          </li>
        </>
      );
    }

    // Si no hay sesión mostramos los botones de login y registro
    return (
      <>
        <li className="nav-item">
          <Link href="/login" className="btn btn-outline-light">
            Iniciar sesión
          </Link>
        </li>
        <li className="nav-item ms-2">
          <Link href="/register" className="btn btn-light">
            Registrarse
          </Link>
        </li>
      </>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link href="/" className="navbar-brand fs-4 fw-bold">
          Task Manager
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">{renderAuthLinks()}</ul>
        </div>
      </div>
    </nav>
  );
}
