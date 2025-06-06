import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const id = searchParams.get("id");

  try {
    if (id) {
      const task = await prisma.task.findUnique({ where: { id: Number(id) } });
      if (!task) return NextResponse.json({ message: "Tarea no encontrada" }, { status: 404 });
      return NextResponse.json(task);
    }

    if (!userId) {
      return NextResponse.json({ message: "Se requiere el ID del usuario" }, { status: 400 });
    }

    const tasks = await prisma.task.findMany({ where: { userId: Number(userId) } });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req) {
  const { title, description, userId, completed = false } = await req.json();

  if (!title || !description || !userId) {
    return NextResponse.json({ message: "Todos los campos son obligatorios" }, { status: 400 });
  }

  try {
    const newTask = await prisma.task.create({
      data: { title, description, userId: Number(userId), completed },
    });
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req) {
  const { id, title, description, completed } = await req.json();

  if (!id || !title || !description) {
    return NextResponse.json(
      { message: "ID, título y descripción son obligatorios" },
      { status: 400 }
    );
  }

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(id) },
      data: { title, description, completed },
    });
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ message: "Se requiere el ID de la tarea" }, { status: 400 });
  }

  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "Tarea eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}
