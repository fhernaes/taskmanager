"use client"; // Agregar esta línea para asegurar que el código se ejecute en el cliente

import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import InstallBootstrap from "@/app/libs/bootstrap";
import Navbar from "@/app/ui/navbar/navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head />
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
      <InstallBootstrap />
    </html>
  );
}
