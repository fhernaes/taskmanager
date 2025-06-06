"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [customError, setCustomError] = useState(""); 
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    setCustomError("");
    try {
      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false // Evita la redirección automática
      });

      if (response?.error) {
        setCustomError(response.error);
      } else {
        // Redirigir manualmente al dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      setCustomError("Error al iniciar sesión. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Correo Electrónico */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="correo@ejemplo.com"
                {...register("email", {
                  required: "Este campo es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Formato de correo electrónico inválido",
                  },
                })}
                aria-describedby="emailHelp"
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Este campo es obligatorio",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                aria-describedby="passwordHelp"
              />
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </div>

            {/* Error de autenticación */}
            {customError && <p className="text-danger text-center">{customError}</p>}

            <button type="submit" className="btn btn-primary w-100 mt-3">
              Iniciar Sesión
            </button>
          </form>

          {/* Enlace a registro */}
          <div className="mt-3 text-center">
            <small className="text-muted">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="nav-link">
                Crear una cuenta
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
