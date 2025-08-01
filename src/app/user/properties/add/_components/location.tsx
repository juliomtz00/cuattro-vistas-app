import React, { useMemo } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import { State } from "@/generated/prisma";
import { PropertyFormData } from "@/types/propertyForm";

interface LocationProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  states: (State & { cities: { id: number; name: string }[] })[];
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Location: React.FC<LocationProps> = ({ formData, setFormData, states, fieldErrors, setFieldErrors }) => {
  const selectedState = states.find((s) => s.id.toString() === formData.stateId);
  const cities = useMemo(() => selectedState?.cities || [], [selectedState]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {/* Estado */}
      <Select
        isRequired
        label="Estado"
        selectedKeys={[formData.stateId]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          setFormData((prev) => ({
            ...prev,
            stateId: selected,
            cityId: "", // reset city when state changes
          }));
        }}
        isInvalid={!!fieldErrors.stateId}
        errorMessage={fieldErrors.stateId}
      >
        {states.map((state) => (
          <SelectItem key={state.id.toString()}>{state.name}</SelectItem>
        ))}
      </Select>

      {/* Ciudad */}
      <Select
        isRequired
        label="Ciudad/Municipio"
        selectedKeys={[formData.cityId]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          setFormData((prev) => ({
            ...prev,
            cityId: selected,
          }));
        }}
        isDisabled={!selectedState}
        isInvalid={!!fieldErrors.cityId}
        errorMessage={fieldErrors.cityId}
      >
        {cities.map((city) => (
          <SelectItem key={city.id.toString()}>{city.name}</SelectItem>
        ))}
      </Select>

      {/* Código Postal */}
      <Input
        isRequired
        type="number"
        label="Código Postal"
        placeholder="Ej: 77500"
        value={formData.zipCode}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 5);
          setFormData((prev) => ({
            ...prev,
            zipCode: value,
          }));
        }}
        isInvalid={!!fieldErrors.zipCode}
        errorMessage={fieldErrors.zipCode}
        className="md:col-span-2 lg:col-span-1 w-full"
      />

      {/* Dirección */}
      <Input
        label="Dirección"
        placeholder="Ej: Calle 123, Colonia Centro"
        value={formData.address}
        onChange={(e) => {
          setFormData((prev) => ({
            ...prev,
            address: e.target.value,
          }));
        }}
        className="md:col-span-2 lg:col-span-3 w-full"
      />

      {/* URL Google Maps */}
      <Input
        label="URL de Google Maps"
        placeholder="https://maps.google.com"
        value={formData.urlGoogleMaps}
        onChange={(e) => {
          const value = e.target.value;
          setFormData((prev) => ({
            ...prev,
            urlGoogleMaps: value,
          }));

          // Clear validation error if empty
          if (value === "") {
            setFieldErrors((prev) => {
              const updated = { ...prev };
              delete updated.urlGoogleMaps;
              return updated;
            });
          }
        }}
        isInvalid={!!fieldErrors.urlGoogleMaps}
        errorMessage={fieldErrors.urlGoogleMaps}
        className="md:col-span-2 lg:col-span-3 w-full"
      />
    </div>
  );
};

export default Location;
