"use client";

import { Button, Link } from "@heroui/react";
import { generatePropertyPDF } from "@/app/components/generatePDF";
import { ImageSlider } from "@/app/components/ImageSlider";
import { PropertyDetails } from "@/types/propertyDetails";

// Recursively converts all null values to undefined, type-safe
type NullToUndefined<T> =
  T extends null ? undefined :
  T extends (infer U)[] ? NullToUndefined<U>[] :
  T extends object ? { [K in keyof T]: NullToUndefined<T[K]> } :
  T;

function nullsToUndefined<T>(obj: T): NullToUndefined<T> {
  if (obj === null) return undefined as NullToUndefined<T>;
  if (Array.isArray(obj)) {
    // TypeScript is happy with arrays
    return obj.map(nullsToUndefined) as NullToUndefined<T>;
  }
  if (typeof obj === "object" && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const key in obj) {
      result[key] = nullsToUndefined(obj[key]);
    }
    // This cast is the only way to convince TypeScript, and it's safe.
    return result as NullToUndefined<T>;
  }
  return obj as NullToUndefined<T>;
}


export default function PropertyDetailClient({ property }: { property: PropertyDetails }) {
  const images = property.images?.length ? property.images.map((img) => img.url) : [];
  const featureTags = [
    property.features?.bedrooms && `${property.features.bedrooms} Recámaras`,
    property.features?.bathrooms && `${property.features.bathrooms} Baños`,
    property.features?.parking && `${property.features.parking} Estac.`,
    property.features?.balcon && "Balcón",
    property.features?.pool && "Alberca",
    property.features?.furnished && "Amueblado",
    property.features?.downtown && "Zona Céntrica",
    property.features?.acceptsCreditBank && "Crédito Bancario",
    property.features?.acceptsCreditSocial && "INFONAVIT/FOVISSSTE",
  ].filter(Boolean);

  return (
    
    <section className="relative w-full px-6 py-8 md:py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <Link
          href="/property"
          className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-base rounded-lg py-2 px-3 bg-blue-50 hover:bg-blue-100 transition"
        >
          Volver a resultados
        </Link>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Info Card (Left on desktop, Top on mobile) */}
        <div className="flex flex-col justify-center px-4 py-8 md:px-8 order-2 lg:order-1">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{property.title}</h1>
          {/* Price */}
          <div className="text-2xl md:text-3xl font-semibold text-blue-700 mb-4">
            {property.price?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
          </div>
          {/* Feature tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {featureTags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Short Description */}
          {property.description && (
            <p className="text-gray-600 text-base mb-5">{property.description}</p>
          )}
          {/* Location summary */}
          <div className="mb-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span>
                <span className="font-medium text-gray-700">Ubicación:</span>{" "}
                {property.location?.city?.name || "Ciudad"},{" "}
                {property.location?.city?.state?.name || "Estado"}
              </span>
              {property.location?.address && (
                <span className="hidden md:inline">| {property.location.address}</span>
              )}
              {property.location?.zipCode && (
                <span className="hidden md:inline">| CP {property.location.zipCode}</span>
              )}
            </div>
            {property.location?.urlGoogleMaps && (
              <a
                className="text-blue-600 underline text-sm mt-2 inline-block"
                href={property.location.urlGoogleMaps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver en Google Maps
              </a>
            )}
          </div>

          {/* Provider */}
          {property.provider?.value && (
            <div className="mb-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Proveedor:</span> {property.provider.value}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 my-6 flex-wrap">
            <Button color="primary" font-color="secondary" className="px-6 py-3 rounded-xl text-base">
              Solicitar información
            </Button>
            <Button
              color="secondary"
              variant="flat"
              className="px-6 py-3 rounded-xl text-base"
              onClick={() => generatePropertyPDF(nullsToUndefined(property))}
            >
              Descargar Ficha Técnica
            </Button>
          </div>

          {/* Details grid */}
          <div className="mt-4 border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Detalles de la Propiedad</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <Detail label="Recámaras" value={property.features?.bedrooms} />
              <Detail label="Baños" value={property.features?.bathrooms} />
              <Detail label="Medios Baños" value={property.features?.halfBathrooms} />
              <Detail label="Estacionamientos" value={property.features?.parking} />
              <Detail label="Terreno (m²)" value={property.features?.terrainM2} />
              <Detail label="Construcción (m²)" value={property.features?.constructionM2} />
              <Detail label="Niveles" value={property.features?.levels} />
              <Detail label="Antigüedad" value={property.features?.age} />
              <Detail label="Dirección" value={property.location?.address} />
              <Detail label="Código Postal" value={property.location?.zipCode} />
              <Detail label="Tipo" value={property.type.value} />
              <Detail label="Estatus" value={property.status.value} />
              <Detail label="Conectividad" value={property.features?.connectivity} />
              <Detail label="Áreas Verdes" value={property.features?.greenAreas} />
            </div>
          </div>
        </div>

        {/* Image/Media Section (Right on desktop, Top on mobile) */}
        <div className="relative bg-gray-50 flex flex-col items-center justify-start p-2 md:p-6 order-1 lg:order-2">
          <div className="w-full max-w-2xl mx-auto">
            {/* ImageSlider, large and responsive */}
            <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
              <ImageSlider images={images} />
            </div>
            {/* Video */}
            {property.videoUrl && (
              <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow">
                <iframe
                  src={property.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video de la propiedad"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable Detail component
const Detail = ({ label, value }: { label: string; value?: string | number | null }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 font-medium">{label}:</span>
      <span className="text-gray-500">{value}</span>
    </div>
  );
};