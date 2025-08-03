"use client";
import React, { useRef, useState } from "react";
import { Button } from "@heroui/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

// For each error, let user pick/correct and retry import of that row
function CorrectionModal({
  errors,
  onAccept,
  onSkip,
  onClose,
  loading,
}: {
  errors: any[];
  onAccept: (row: any, value: string) => void;
  onSkip: () => void;
  onClose: () => void;
  loading: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [customValue, setCustomValue] = useState("");
  const current = errors[currentIndex];

  React.useEffect(() => {
    setCustomValue(""); // Reset custom value when changing error
  }, [currentIndex, errors]);

  if (!current) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-2">Corrige el campo</h2>
        <div className="mb-2">
          <b>Fila:</b> {current.row}<br />
          <b>Campo:</b> {current.field}<br />
          <b>Valor:</b> <span className="text-red-700">{current.value}</span>
          <br />
          <b>Mensaje:</b> {current.message}
        </div>
        {current.suggestions && current.suggestions.length > 0 && (
          <div className="mb-2">
            <span className="text-gray-500">¿Quieres seleccionar una sugerencia?</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {current.suggestions.map((s: string, i: number) => (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => onAccept(current, s)}
                  disabled={loading}
                  color="secondary"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="mb-2">
          <span className="text-gray-500">O escribe un valor correcto:</span>
          <input
            className="border px-2 py-1 rounded ml-2"
            type="text"
            value={customValue}
            onChange={e => setCustomValue(e.target.value)}
            disabled={loading}
            placeholder="Valor corregido"
          />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <Button color="danger" onClick={onClose} disabled={loading}>Cerrar</Button>
          <Button color="default" onClick={onSkip} disabled={loading}>Omitir fila</Button>
          <Button
            color="success"
            onClick={() => {
              if (customValue.trim()) {
                onAccept(current, customValue.trim());
              }
            }}
            disabled={loading || !customValue.trim()}
          >
            Aceptar corrección
          </Button>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          {loading ? "Guardando, por favor espera..." : ""}
        </div>
      </div>
    </div>
  );
}

export default function ImportCSV() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useKindeBrowserClient();
  const [errors, setErrors] = useState<any[]>([]);
  const [pendingErrors, setPendingErrors] = useState<any[]>([]);
  const [imported, setImported] = useState<number | null>(null);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // When user corrects an error: try to re-import the row with the correction
  const handleAcceptCorrection = async (errorRow: any, value: string) => {
    setLoading(true);
    // Send fix-row with rowIndex, field, value, and any extra info needed
    const res = await fetch("/api/import-csv/fix-row", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        row: errorRow.row,
        field: errorRow.field,
        value,
        original: errorRow,
      }),
    });
    setLoading(false);

    if (res.ok) {
      // On success: remove this error from list and show next
      const newErrors = [...pendingErrors];
      newErrors.shift();
      setPendingErrors(newErrors);
      setImported((prev) => (prev ?? 0) + 1);
      if (newErrors.length === 0) {
        setErrors([]);
        alert("Propiedad corregida e importada.");
        window.location.reload();
      }
    } else {
      const data = await res.json();
      // If still error: update this error (maybe new suggestions)
      const newErrors = [...pendingErrors];
      newErrors[0] = data.failedRow || errorRow;
      setPendingErrors(newErrors);
      alert("Sigue habiendo un problema. Revisa el valor o agrega una opción nueva.");
    }
  };

  // When user skips a row
  const handleSkip = () => {
    const newErrors = [...pendingErrors];
    newErrors.shift();
    setPendingErrors(newErrors);
    if (newErrors.length === 0) setErrors([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setErrors([]);
    setPendingErrors([]);
    setImported(null);
    setWarnings([]);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id); // <-- IMPORTANTE

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
        setPendingErrors([...data.failedRows]);
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

      {/* Corrección interactiva una por una */}
      {pendingErrors.length > 0 && (
        <CorrectionModal
          errors={pendingErrors}
          onAccept={handleAcceptCorrection}
          onSkip={handleSkip}
          onClose={() => setPendingErrors([])}
          loading={loading}
        />
      )}
    </>
  );
}
