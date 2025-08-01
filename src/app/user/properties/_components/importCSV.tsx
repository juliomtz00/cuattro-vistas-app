"use client";
import React, { useRef } from "react";
import { Button } from "@heroui/react";

export default function ImportCSV() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/import-csv", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Propiedades cargadas correctamente.");
      window.location.reload();
    } else {
      alert("Error al cargar el archivo. Revisa el formato.");
    }
  };

  return (
    <>
      <Button
        className="bg-background text-b border border-gray-300"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        Cargar con Archivo CSV
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
