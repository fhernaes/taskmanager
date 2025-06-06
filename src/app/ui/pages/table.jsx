import React from "react";

export default function Table({ 
  columns, 
  data,    
  actions  
}) {
  return (
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.label}</th>
          ))}
          {actions?.length > 0 && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((item) => (
            <tr key={item.id}>
              {columns.map((col, index) => (
                <td key={index}>
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}
              {actions?.length > 0 && (
                <td>
                  <div className="d-flex">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        className={`btn ${action.className} me-2`}
                        onClick={() => action.onClick(item)}
                      >
                        {action.icon} {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center">
              No hay datos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
