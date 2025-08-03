"use client";
import React, { useRef, useState } from "react";
import { Button } from "@heroui/react";

// Define the types for the props of the CorrectionModal component
interface CorrectionModalProps {
  errors: Array<{
    row: number;
    field?: string;
    value?: string;
    suggestions?: string[];
    message: string;
  }>;
  onClose: () => void;
}

// Pequeño componente de corrección para campos problemáticos
function CorrectionModal({ errors, onClose }: CorrectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">¡Corrige los siguientes campos!</h2>
        <ul className="mb-4 max-h-64 overflow-y-auto">
          {errors.map((err, idx) => (
            <li key={idx} className="mb-2">
              <b>Fila:</b> {err.row} — <b>{err.message}</b><br />
              {/* Added an explicit check for the existence of `err.suggestions` to resolve the type error */}
              {err.suggestions && err.suggestions.length > 0 && (
                <>
                  <span className="text-gray-500">Sugerencias: </span>
                  {err.suggestions.join(", ")}
                </>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-3 justify-end">
          <Button color="danger" onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </div>
  );
}

export default function ImportCSV() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [imported, setImported] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors([]);
    setImported(null);
    setWarnings([]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import-csv", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setImported(data.imported);
      setWarnings(data.warnings || []);
      alert("Propiedades cargadas correctamente: " + data.imported);
      window.location.reload();
    } else {
      const data = await res.json();
      if (data.failedRows?.length) {
        setErrors(data.failedRows);
      } else {
        alert(data.error || "Error al cargar el archivo. Revisa el formato.");
      }
    }
  };

  return (
    <>
      <Button
        className="bg-background text-b border border-gray-300"
        onClick={() => fileInputRef.current?.click()}
        type="button"
        disabled={loading}
      >
        {loading ? "Importando..." : "Cargar con Archivo CSV"}
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Modal de errores/correcciones */}
      {errors.length > 0 && (
        <CorrectionModal
          errors={errors}
          onClose={() => setErrors([])}
        />
      )}
    </>
  );
}
