"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [currentTask, setCurrentTask] = useState(null);
  const [sortState, setSortState] = useState("none");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar tareas del usuario autenticado
  const handleFetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/tasks?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Error al cargar tareas");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      handleError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Función auxiliar para manejar errores
  const handleError = (message) => {
    console.error(message);
    // Aquí podrías agregar más lógica de manejo de errores si es necesario
  };

  // Cargar tareas del usuario autenticado
  const fetchTasks = async () => {
    try {
      const res = await fetch(`/api/tasks?userId=${session.user.id}`);
      if (!res.ok) throw new Error("Error al cargar tareas");
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      handleError(error.message);
    }
  };

  // Guardar o actualizar tarea
  const onSubmit = async (data) => {
    if (!session?.user?.id) return handleError("Usuario no autenticado");

    try {
      const method = formMode === "edit" ? "PUT" : "POST";
      const res = await fetch(`/api/tasks`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          userId: session.user.id, // Usar ID del usuario autenticado
          id: currentTask?.id,
        }),
      });
      if (!res.ok) throw new Error("Error al guardar la tarea");
      await fetchTasks(); // Recargar tareas después de guardar
      resetForm();
    } catch (error) {
      handleError(error.message);
    }
  };

  // Actualizar estado de una tarea (toggle completado)
  const toggleTaskCompletion = async (task) => {
    if (!session?.user?.id) return handleError("Usuario no autenticado");

    try {
      const updatedTask = { ...task, completed: !task.completed };
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updatedTask : t))
      );

      const res = await fetch(`/api/tasks`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      if (!res.ok) throw new Error("Error al actualizar tarea");
    } catch (error) {
      handleError(error.message);
    }
  };

  // Eliminar tarea
  const deleteTask = async (id) => {
    if (!session?.user?.id) return handleError("Usuario no autenticado");

    try {
      const res = await fetch(`/api/tasks`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Error al eliminar tarea");
      setTasks((prev) => prev.filter((task) => task.id !== id));
      resetForm();
    } catch (error) {
      handleError(error.message);
    }
  };

  // Ordenar tareas por estado
  const sortTasksByState = () => {
    let sortedTasks = [...tasks];
    if (sortState === "asc") {
      sortedTasks.sort((a, b) => b.completed - a.completed);
      setSortState("desc");
    } else if (sortState === "desc") {
      sortedTasks.sort((a, b) => a.completed - b.completed);
      setSortState("none");
    } else {
      setSortState("asc");
    }
    setTasks(sortedTasks);
  };

  // Preparar formulario para edición
  const handleEdit = (task) => {
    setFormMode("edit");
    setCurrentTask(task);
    setShowForm(true);

    setValue("title", task.title);
    setValue("description", task.description);
    setValue("completed", task.completed);
  };

  // Resetear formulario
  const resetForm = () => {
    reset();
    setShowForm(false);
    setFormMode("create");
    setCurrentTask(null);
  };
 
  // Cargar tareas al montar componente
  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="container my-4">
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="text-primary">Mis Tareas</h1>
          <button className="btn btn-primary">
            <FaPlus /> Nueva Tarea
          </button>
        </header>

        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array(5).fill().map((_, index) => (
                <tr key={index}>
                  <td><div className="skeleton-cell"></div></td>
                  <td><div className="skeleton-cell"></div></td>
                  <td><div className="skeleton-cell"></div></td>
                  <td><div className="skeleton-cell"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary">Mis Tareas</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> Nueva Tarea
        </button>
      </header>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={sortTasksByState}
                title="Clic para ordenar"
              >
                Estado
                {sortState === "asc" && " ↑"}
                {sortState === "desc" && " ↓"}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <span
                    className={`badge ${task.completed ? "bg-success" : "bg-warning"} text-white`}
                    style={{ fontSize: "0.9rem" }}
                  >
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleEdit(task)}
                    title="Editar tarea"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteTask(task.id)}
                    title="Eliminar tarea"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Formulario */}
      {showForm && (
        <form
          className="mt-4 border p-4 rounded shadow-sm bg-light"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <label className="form-label">Título</label>
            <input
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              {...register("title", { required: "El título es obligatorio" })}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              {...register("description", {
                required: "La descripción es obligatoria",
              })}
            ></textarea>
            {errors.description && (
              <div className="invalid-feedback">{errors.description.message}</div>
            )}
          </div>
          <div className="form-check mb-3">
            <input
              type="checkbox"
              className={`form-check-input ${errors.completed ? 'is-invalid' : ''}`}
              {...register("completed")}
            />
            <label className="form-check-label">Completada</label>
          </div>
          <button type="submit" className="btn btn-primary">
            {formMode === "edit" ? "Actualizar" : "Guardar"}
          </button>
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={() => {
              setShowForm(false);
              reset();
              setFormMode("create");
              setCurrentTask(null);
            }}
          >
            Cancelar
          </button>
        </form>
      )}
    </div>
  );
}
