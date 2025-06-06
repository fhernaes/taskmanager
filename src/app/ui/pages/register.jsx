'use client'

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState(null);
  const router = useRouter();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
   
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        router.push("/login"); 
      } else {
        const errorMessage = await res.text();
        console.log(errorMessage)
        setError(errorMessage); 
      }
    } catch (err) {
      setError("Hubo un error al registrar el usuario.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Registrarse</h3>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre de Usuario */}
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de Usuario</label>
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Nombre de usuario"
                {...register("username", { required: "El nombre de usuario es obligatorio" })}
              />
              {errors.username && <p className="text-danger">{errors.username.message}</p>}
            </div>

            {/* Correo Electrónico */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="correo@ejemplo.com"
                {...register("email", {
                  required: "El correo electrónico es obligatorio",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Formato de correo electrónico inválido"
                  }
                })}
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
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres"
                  }
                })}
              />
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Debes confirmar la contraseña",
                  validate: value => value === password || "Las contraseñas no coinciden"
                })}
              />
              {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" className="btn btn-primary w-100">Registrarse</button>
          </form>

          {error && <p className="text-danger text-center">{error}</p>}

          <div className="mt-3 text-center">
            <small className="text-muted">
              ¿Ya tienes una cuenta? <Link href="/login">Iniciar Sesión</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}
