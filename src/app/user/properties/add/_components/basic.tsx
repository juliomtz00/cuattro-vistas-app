"use client";
import React from "react";
import { Input, Select, SelectItem, Checkbox } from "@heroui/react";
import {
  PropertyType,
  PropertyStatus,
  Provider,
  PropertyRange,
  Illumination,
  PropertyCondition,
  ZoneDemand,
  Accesibility,
} from "@/generated/prisma";
import { PropertyFormData } from "@/types/propertyForm";

interface BasicProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  types: PropertyType[];
  statuses: PropertyStatus[];
  providers: Provider[];
  ranges: PropertyRange[];
  illuminations: Illumination[];
  conditions: PropertyCondition[];
  demands: ZoneDemand[];
  accesibilities: Accesibility[];
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const Basic: React.FC<BasicProps> = ({
  formData,
  setFormData,
  types,
  statuses,
  providers,
  ranges,
  illuminations,
  conditions,
  demands,
  accesibilities,
  fieldErrors,
  setFieldErrors,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <Input
        isRequired
        label="ID Propiedad"
        value={formData.propertyId}
        onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
        isInvalid={!!fieldErrors.propertyId}
        errorMessage={fieldErrors.propertyId}
      />

      <Input
        isRequired
        label="Título"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        isInvalid={!!fieldErrors.title}
        errorMessage={fieldErrors.title}
      />

      <Input
        isRequired
        type="number"
        label="Precio"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        isInvalid={!!fieldErrors.price}
        errorMessage={fieldErrors.price}
      />

      <Input
        label="Video URL"
        value={formData.videoUrl}
        onChange={(e) => {
          const value = e.target.value;
          setFormData({ ...formData, videoUrl: value });

          // Clear the error if the field is empty
          if (value === "") {
            setFieldErrors((prev) => {
              const updated = { ...prev };
              delete updated.videoUrl;
              return updated;
            });
          }
        }}
        isInvalid={!!fieldErrors.videoUrl}
        errorMessage={fieldErrors.videoUrl}
        className="md:col-span-2 lg:col-span-1"
      />

      <Select
        isRequired
        label="Tipo de Propiedad"
        selectedKeys={[formData.propertyTypeId]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, propertyTypeId: Array.from(keys)[0] as string })
        }
        isInvalid={!!fieldErrors.propertyTypeId}
        errorMessage={fieldErrors.propertyTypeId}
      >
        {types.map((t) => (
          <SelectItem key={t.id.toString()}>{t.value}</SelectItem>
        ))}
      </Select>

      <Select
        isRequired
        label="Estatus"
        selectedKeys={[formData.statusId]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, statusId: Array.from(keys)[0] as string })
        }
        isInvalid={!!fieldErrors.statusId}
        errorMessage={fieldErrors.statusId}
      >
        {statuses.map((s) => (
          <SelectItem key={s.id.toString()}>{s.value}</SelectItem>
        ))}
      </Select>

      {/* Optional fields */}
      <Select
        label="Proveedor"
        selectedKeys={[formData.providerId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, providerId: Array.from(keys)[0] as string })
        }
      >
        {providers.map((p) => (
          <SelectItem key={p.id}>{p.value}</SelectItem>
        ))}
      </Select>

      <Select
        label="Rango de Vivienda"
        selectedKeys={[formData.propertyRangeId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, propertyRangeId: Array.from(keys)[0] as string })
        }
      >
        {ranges.map((r) => (
          <SelectItem key={r.id.toString()}>{r.value}</SelectItem>
        ))}
      </Select>

      <Select
        label="Iluminación"
        selectedKeys={[formData.illuminationId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, illuminationId: Array.from(keys)[0] as string })
        }
      >
        {illuminations.map((i) => (
          <SelectItem key={i.id.toString()}>{i.value}</SelectItem>
        ))}
      </Select>

      <Select
        label="Condición del Inmueble"
        selectedKeys={[formData.propertyConditionId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, propertyConditionId: Array.from(keys)[0] as string })
        }
      >
        {conditions.map((c) => (
          <SelectItem key={c.id.toString()}>{c.value}</SelectItem>
        ))}
      </Select>

      <Select
        label="Demanda de Zona"
        selectedKeys={[formData.zoneDemandId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, zoneDemandId: Array.from(keys)[0] as string })
        }
      >
        {demands.map((d) => (
          <SelectItem key={d.id.toString()}>{d.value}</SelectItem>
        ))}
      </Select>

      <Select
        label="Accesibilidad"
        selectedKeys={[formData.accesibilityId || ""]}
        onSelectionChange={(keys) =>
          setFormData({ ...formData, accesibilityId: Array.from(keys)[0] as string })
        }
      >
        {accesibilities.map((a) => (
          <SelectItem key={a.id.toString()}>{a.value}</SelectItem>
        ))}
      </Select>

      <Input
        label="Descripción"
        placeholder="Descripción detallada"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="md:col-span-2 lg:col-span-3"
      />

      <div className="flex flex-wrap gap-4 md:col-span-2 lg:col-span-3">
        <Checkbox
          isSelected={formData.availability}
          onValueChange={(val) => setFormData({ ...formData, availability: val })}
        >
          Disponible
        </Checkbox>
      </div>
    </div>
  );
};

export default Basic;
