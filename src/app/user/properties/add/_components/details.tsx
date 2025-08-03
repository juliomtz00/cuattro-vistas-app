import React from "react";
import { Input, Checkbox } from "@heroui/react";
import { PropertyFormData } from "@/types/propertyForm";

interface DetailsProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  fieldErrors: Record<string, string>;
}

const Details: React.FC<DetailsProps> = ({ formData, setFormData, fieldErrors }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* Bathrooms */}
      <Input
        type="number"
        label="Recámaras"
        placeholder="Ej: 2"
        value={formData.bedrooms}
        onChange={(e) => setFormData((prev) => ({ ...prev, bedrooms: e.target.value }))}
        isInvalid={!!fieldErrors.bedrooms}
        errorMessage={fieldErrors.bedrooms}
      />
      <Input
        type="number"
        label="Baños Completos"
        placeholder="Ej: 2"
        value={formData.bathrooms}
        onChange={(e) => setFormData((prev) => ({ ...prev, bathrooms: e.target.value }))}
        isInvalid={!!fieldErrors.bathrooms}
        errorMessage={fieldErrors.bathrooms}
      />

      <Input
        type="number"
        label="Medios Baños"
        placeholder="Ej: 1"
        value={formData.halfBathrooms}
        onChange={(e) => setFormData((prev) => ({ ...prev, halfBathrooms: e.target.value }))}
        isInvalid={!!fieldErrors.halfBathrooms}
        errorMessage={fieldErrors.halfBathrooms}
      />

      <Input
        type="number"
        label="Estacionamientos"
        placeholder="Ej: 2"
        value={formData.parking}
        onChange={(e) => setFormData((prev) => ({ ...prev, parking: e.target.value }))}
        isInvalid={!!fieldErrors.parking}
        errorMessage={fieldErrors.parking}
      />

      {/* Area */}
      <Input
        type="number"
        label="Terreno (m²)"
        placeholder="Ej: 120"
        value={formData.terrainM2}
        onChange={(e) => setFormData((prev) => ({ ...prev, terrainM2: e.target.value }))}
        isInvalid={!!fieldErrors.terrainM2}
        errorMessage={fieldErrors.terrainM2}
      />

      <Input
        type="number"
        label="Construcción (m²)"
        placeholder="Ej: 90"
        value={formData.constructionM2}
        onChange={(e) => setFormData((prev) => ({ ...prev, constructionM2: e.target.value }))}
        isInvalid={!!fieldErrors.constructionM2}
        errorMessage={fieldErrors.constructionM2}
      />

      <Input
        type="number"
        label="Niveles"
        placeholder="Ej: 2"
        value={formData.levels}
        onChange={(e) => setFormData((prev) => ({ ...prev, levels: e.target.value }))}
        isInvalid={!!fieldErrors.levels}
        errorMessage={fieldErrors.levels}
      />

      <Input
        type="number"
        label="Antigüedad (años)"
        placeholder="Ej: 5"
        value={formData.age}
        onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
        isInvalid={!!fieldErrors.age}
        errorMessage={fieldErrors.age}
      />

      {/* Connectivity */}
      <Input
        label="Conectividad"
        placeholder="Ej: Internet de fibra óptica"
        value={formData.connectivity}
        onChange={(e) => setFormData((prev) => ({ ...prev, connectivity: e.target.value }))}
      />

      {/* Green Areas */}
      <Input
        label="Áreas Verdes"
        placeholder="Ej: Jardín, parque cercano"
        value={formData.greenAreas}
        onChange={(e) => setFormData((prev) => ({ ...prev, greenAreas: e.target.value }))}
      />

      {/* Boolean Checkboxes */}
      <Checkbox
        isSelected={formData.balcon}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, balcon: val }))}
      >
        Balcón
      </Checkbox>

      <Checkbox
        isSelected={formData.pool}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, pool: val }))}
      >
        Alberca
      </Checkbox>

      <Checkbox
        isSelected={formData.downtown}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, downtown: val }))}
      >
        Zona Centro
      </Checkbox>

      <Checkbox
        isSelected={formData.furnished}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, furnished: val }))}
      >
        Amueblado
      </Checkbox>

      <Checkbox
        isSelected={formData.acceptsCreditBank}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, acceptsCreditBank: val }))}
      >
        ¿Acepta Crédito Bancario?
      </Checkbox>

      <Checkbox
        isSelected={formData.acceptsCreditSocial}
        onValueChange={(val) => setFormData((prev) => ({ ...prev, acceptsCreditSocial: val }))}
      >
        ¿Acepta Crédito Social?
      </Checkbox>
    </div>
  );
};

export default Details;
