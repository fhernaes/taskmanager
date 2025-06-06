import { FaTasks, FaChartLine, FaKey } from "react-icons/fa";

export default function Home() {

  return (
    <div className="container my-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold mt-4">
          Bienvenido a <span className="text-primary">Task Manager</span>
        </h1>
        <p className="lead text-muted">
          La herramienta definitiva para organizar, priorizar y completar tus tareas diarias.
        </p>
      </header>

      <section className="row text-center mb-5">
        <div className="col-md-4">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <FaTasks className="feature-icon" />
            </div>
            <h3 className="mt-3">Organiza tus tareas</h3>
            <p className="text-muted">Crea y clasifica tus tareas según prioridades y plazos.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <FaChartLine className="feature-icon" />
            </div>
            <h3 className="mt-3">Haz seguimiento</h3>
            <p className="text-muted">Marca tareas completadas y visualiza tu progreso.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-4 border rounded shadow-sm h-100">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <FaKey className="feature-icon" />
            </div>
            <h3 className="mt-3">Acceso Administrador</h3>
            <p className="text-muted">Inicia sesión como administrador para ver y gestionar todas las tareas de los usuarios.</p>
          </div>
        </div>
      </section>


    </div>
  );
}
