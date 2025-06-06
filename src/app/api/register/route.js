import prisma from "@/app/libs/prisma"; 
import bcrypt from "bcrypt"; 

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || username.length < 3) {
      return new Response("El nombre de usuario debe tener al menos 3 caracteres", {
        status: 400,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return new Response("Correo electrónico inválido", {
        status: 400,
      });
    }

    if (!password || password.length < 6) {
      return new Response("La contraseña debe tener al menos 6 caracteres", {
        status: 400,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return new Response("El nombre de usuario o el correo ya están en uso", {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {

    console.error("Error al registrar usuario:", error);

    if (error.code === "P2002") { 
      return new Response("El correo electrónico o nombre de usuario ya están registrados", {
        status: 400,
      });
    }

    return new Response("Ocurrió un error en el servidor", {
      status: 500,
    });
  }
}
