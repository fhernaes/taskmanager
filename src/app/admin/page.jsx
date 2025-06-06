"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetch("/api/admin/tasks")
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar tareas");
          return res.json();
        })
        .then((data) => {
          setTasks(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error al cargar las tareas. Por favor, intenta de nuevo.");
          setLoading(false);
        });
    }
  }, [session]);

  if (session?.user?.role !== "admin") {
    return <div className="alert alert-danger">No tienes acceso a esta página.</div>;
  }

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center">No hay tareas disponibles de los usuarios.</div>;
  }

  return (
    <div className="container my-4">
      <h1 className="text-primary">Panel de Administración</h1>
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Usuario</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha de Creación</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.user.username}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <span className={`badge ${task.completed ? "bg-success" : "bg-warning"}`}>
                    {task.completed ? "Completada" : "Pendiente"}
                  </span>
                </td>
                <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
