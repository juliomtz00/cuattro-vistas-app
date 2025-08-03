// app/properties/_components/PropertyFilter.tsx
"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// --- Types ---
export type PropertySearchParams = {
  state?: string;
  city?: string;
  zip?: string;
  priceMin?: string;
  priceMax?: string;
  bedrooms?: string;
  bathrooms?: string;
  status?: string;
  type?: string;
  parking?: string;
  maxAge?: string;
  propertyRange?: string;
};

type State = {
  id: number;
  name: string;
  cities: { id: number; name: string }[];
};

type Option = { id: number; value: string; name?: string };

// --- Props ---
interface PropertyFilterProps {
  states: State[];
  types: Option[];
  statuses: Option[];
  ranges: Option[];
  initialParams?: PropertySearchParams;
}

const bedroomsList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const bathroomsList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const parkingList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function PropertyFilter({
  states,
  types,
  statuses,
  ranges,
  initialParams = {},
}: PropertyFilterProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<PropertySearchParams>({
    ...initialParams,
  });

  // For dependent dropdown
  const selectedState = useMemo(
    () => states.find((s) => s.id === Number(filters.state)),
    [filters.state, states]
  );
  const availableCities = selectedState ? selectedState.cities : [];

  function handleChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    const { name, value } = e.target;
    // Reset city when state changes
    if (name === "state") {
      setFilters((f) => ({ ...f, [name]: value, city: "" }));
    } else {
      setFilters((f) => ({ ...f, [name]: value }));
    }
  }

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    // Build URL params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`/property?${params.toString()}`);
  }

  function resetFilters() {
    setFilters({});
    router.push("/property");
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow px-5">
      {/* Collapsible trigger */}
      <button
        className="flex items-center gap-2 text-lg font-semibold mb-6 focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="material-icons text-primary">{open ? "Cerrar" : "Filtrar"}</span>
        Propiedades
      </button>
      {/* Collapsible content */}
      {open && (
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div>
              <label className="block text-sm mb-1">Estado</label>
              <select
                name="state"
                value={filters.state || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione Estado</option>
                {states.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Municipio/Alcaldía</label>
              <select
                name="city"
                value={filters.city || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                disabled={!filters.state}
              >
                <option value="">Seleccione Alcaldía</option>
                {availableCities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Código Postal</label>
              <input
                name="zip"
                value={filters.zip || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                type="number"
                placeholder="Escriba un Código Postal"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Tipo de Propiedad</label>
              <select
                name="type"
                value={filters.type || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione Tipo</option>
                {types.map((t) => (
                  <option key={t.id} value={t.id}>{t.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Estatus</label>
              <select
                name="status"
                value={filters.status || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione Estatus</option>
                {statuses.map((s) => (
                  <option key={s.id} value={s.id}>{s.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Habitaciones</label>
              <select
                name="bedrooms"
                value={filters.bedrooms || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione</option>
                {bedroomsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Baños</label>
              <select
                name="bathrooms"
                value={filters.bathrooms || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione</option>
                {bathroomsList.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Estacionamientos</label>
              <select
                name="parking"
                value={filters.parking || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione</option>
                {parkingList.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Antigüedad Máx.</label>
              <input
                name="maxAge"
                value={filters.maxAge || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                type="number"
                placeholder="Años"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Rango de Vivienda</label>
              <select
                name="propertyRange"
                value={filters.propertyRange || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
              >
                <option value="">Seleccione Rango</option>
                {ranges.map((r) => (
                  <option key={r.id} value={r.id}>{r.value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Precio Mínimo</label>
              <input
                name="priceMin"
                value={filters.priceMin || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                type="number"
                placeholder="Precio Mínimo"
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Precio Máximo</label>
              <input
                name="priceMax"
                value={filters.priceMax || ""}
                onChange={handleChange}
                className="w-full rounded border px-3 py-2"
                type="number"
                placeholder="Precio Máximo"
                min={0}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <button type="submit" className="bg-primary text-white rounded-xl px-5 py-2 font-semibold shadow hover:bg-secondary">
              Aplicar Filtros
            </button>
            <button type="button" className="bg-gray-100 text-secondary rounded-xl px-5 py-2 font-semibold hover:bg-gray-200" onClick={resetFilters}>
              Limpiar Selección
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
