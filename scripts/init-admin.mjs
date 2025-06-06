import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";

const prisma = new PrismaClient();

const isDev = process.env.NODE_ENV === "development";

async function adminExists() {
  return await prisma.user.findFirst({ where: { role: "admin" } });
}

function generatePassword(length = 16) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  return Array.from(crypto.randomBytes(length))
    .map(byte => charset[byte % charset.length])
    .join('');
}

async function createAdmin() {
  const password = generatePassword();
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username: "admin",
      email: "admin@example.com",
      password: hashed,
      role: "admin"
    }
  });

  if (isDev) {
    console.log(`
=== ADMINISTRADOR CREADO ===
Usuario: admin
Contraseña generada: ${password}
¡Importante! Cambia esta contraseña después de iniciar sesión.
    `);
  }
}

async function main() {
  if (!isDev) {
    console.error("Este script solo debe ejecutarse en modo desarrollo");
    return;
  }

  try {
    if (await adminExists()) {
      console.log("Ya existe un usuario administrador en el sistema.");
      return;
    }

    await createAdmin();
  } catch (error) {
    console.error("Error al crear el administrador:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
