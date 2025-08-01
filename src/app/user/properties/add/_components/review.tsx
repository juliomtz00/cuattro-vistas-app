import React, { useMemo } from "react";
import { PropertyFormData } from "@/types/propertyForm";
import { State } from "@/generated/prisma";

interface ReviewProps {
  formData: PropertyFormData;
  states: (State & { cities: { id: number; name: string }[] })[];
}

const Review = ({ formData, states }: ReviewProps) => {
  const stateName = useMemo(() => {
    return states.find((s) => s.id.toString() === formData.stateId)?.name || "N/A";
  }, [formData.stateId, states]);

  const cityName = useMemo(() => {
    const state = states.find((s) => s.id.toString() === formData.stateId);
    return state?.cities.find((c) => c.id.toString() === formData.cityId)?.name || "N/A";
  }, [formData.cityId, formData.stateId, states]);

  return (
    <div className="w-full flex flex-col gap-6 text-sm text-gray-700 text-center">
      <h3 className="text-2xl font-bold mb-2">Revisión de la Información</h3>

      {/* Información Básica */}
      <div>
        <h4 className="font-bold text-primary mb-1 text-lg">Información Básica</h4>
        <p className="font-light text-secondary text-sm"><strong>ID Propiedad:</strong> {formData.propertyId}</p>
        <p className="font-light text-secondary text-sm"><strong>Título:</strong> {formData.title}</p>
        <p className="font-light text-secondary text-sm"><strong>Descripción:</strong> {formData.description}</p>
        <p className="font-light text-secondary text-sm"><strong>Precio:</strong> ${formData.price}</p>
        <p className="font-light text-secondary text-sm"><strong>Disponible:</strong> {formData.availability ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Video URL:</strong> {formData.videoUrl || ""}</p>
      </div>

      {/* Ubicación */}
      <div>
        <h4 className="font-bold text-primary mb-1 text-lg">Ubicación</h4>
        <p className="font-light text-secondary text-sm"><strong>Estado:</strong> {stateName}</p>
        <p className="font-light text-secondary text-sm"><strong>Ciudad:</strong> {cityName}</p>
        <p className="font-light text-secondary text-sm"><strong>Dirección:</strong> {formData.address || ""}</p>
        <p className="font-light text-secondary text-sm"><strong>Código Postal:</strong> {formData.zipCode}</p>
        <p className="font-light text-secondary text-sm"><strong>Google Maps:</strong> {formData.urlGoogleMaps || ""}</p>
      </div>

      {/* Detalles */}
      <div>
        <h4 className="font-bold text-primary mb-1 text-lg">Detalles</h4>
        <p className="font-light text-secondary text-sm"><strong>Recámaras:</strong> {formData.bedrooms || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Baños Completos:</strong> {formData.bathrooms || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Medios Baños:</strong> {formData.halfBathrooms || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Estacionamientos:</strong> {formData.parking || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Terreno (m²):</strong> {formData.terrainM2 || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Construcción (m²):</strong> {formData.constructionM2 || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Niveles:</strong> {formData.levels || 0}</p>
        <p className="font-light text-secondary text-sm"><strong>Antigüedad:</strong> {formData.age || 0} años</p>
        <p className="font-light text-secondary text-sm"><strong>Balcón:</strong> {formData.balcon ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Alberca:</strong> {formData.pool ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Amueblado:</strong> {formData.furnished ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Zona Centro:</strong> {formData.downtown ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Acepta Crédito Bancario:</strong> {formData.acceptsCreditBank ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Acepta Crédito Social:</strong> {formData.acceptsCreditSocial ? "Sí" : "No"}</p>
        <p className="font-light text-secondary text-sm"><strong>Conectividad:</strong> {formData.connectivity || ""}</p>
        <p className="font-light text-secondary text-sm"><strong>Áreas Verdes:</strong> {formData.greenAreas || ""}</p>
      </div>

      {/* Archivos */}
      <div>
        <h4 className="font-bold text-primary mb-1 text-lg">Archivos</h4>
        {formData.files && formData.files.length > 0 ? (
          <ul className="list-disc list-inside font-light text-secondary text-sm">
            {formData.files.map((file: File, idx: number) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p className="font-light text-secondary text-sm">No se han subido archivos.</p>
        )}
      </div>
    </div>
  );
};

export default Review