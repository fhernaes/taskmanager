import { getToken } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.role !== "admin") {
    return NextResponse.json({ message: "Acceso denegado" }, { status: 403 });
  }

  try {
    const tasks = await prisma.task.findMany({
      include: { user: { select: { username: true } } },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    return NextResponse.json(
      { message: "Error al obtener las tareas", error: error.message },
      { status: 500 }
    );
  }
}
export async function POST() {
  return NextResponse.json({ message: "Método no permitido" }, { status: 405 });
}
export async function PUT() {
  return NextResponse.json({ message: "Método no permitido" }, { status: 405 });
}
export async function DELETE() {
  return NextResponse.json({ message: "Método no permitido" }, { status: 405 });
}
