"use client";

import React, { useState, useEffect } from "react";
import { Form, Button } from "@heroui/react";
import Stepper from "./Stepper";
import Basic from "./basic";
import Location from "./location";
import Details from "./details";
import FilesStep from "./filesStep";
import Review from "./review";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { uploadToS3 } from "@/lib/uploadAWS";
import { saveProperty } from "@/lib/actions/property";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { AddPropertyFormSchema } from "@/lib/zodSchema";
import { PropertyFormData } from "@/types/propertyForm";
import {
  PropertyType,
  PropertyStatus,
  State,
  Provider,
  PropertyRange,
  Illumination,
  PropertyCondition,
  ZoneDemand,
  Accesibility,
} from "@/generated/prisma";

const steps = [
  { label: "Información Básica" },
  { label: "Ubicación" },
  { label: "Detalles" },
  { label: "Archivos" },
  { label: "Revisión" },
];

interface AddPropertyFormProps {
  types: PropertyType[];
  statuses: PropertyStatus[];
  states: (State & { cities: { id: number; name: string }[] })[];
  providers: Provider[];
  ranges: PropertyRange[];
  illuminations: Illumination[];
  conditions: PropertyCondition[];
  demands: ZoneDemand[];
  accesibilities: Accesibility[];
  property?: PropertyFormData;   // <-- Añadido para editar
  isEdit?: boolean;              // <-- Añadido para editar
}

export type AddPropertyInputType = z.infer<typeof AddPropertyFormSchema>;

export default function AddPropertyForm({
  types,
  statuses,
  states,
  providers,
  ranges,
  illuminations,
  conditions,
  demands,
  accesibilities,
  property,
  isEdit = false,
}: AddPropertyFormProps) {
  const [step, setStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyId: "",
    title: "",
    description: "",
    price: "",
    availability: true,
    videoUrl: "",
    propertyTypeId: "",
    statusId: "",
    providerId: "",
    propertyRangeId: "",
    illuminationId: "",
    propertyConditionId: "",
    zoneDemandId: "",
    accesibilityId: "",
    stateId: "",
    cityId: "",
    address: "",
    zipCode: "",
    urlGoogleMaps: "",
    bedrooms: "",
    bathrooms: "",
    halfBathrooms: "",
    balcon: false,
    pool: false,
    furnished: false,
    downtown: false,
    terrainM2: "",
    constructionM2: "",
    levels: "",
    parking: "",
    acceptsCreditBank: false,
    acceptsCreditSocial: false,
    age: "",
    connectivity: "",
    greenAreas: "",
    files: [],
  });

  // Soporte para edición: si property cambia, setear los datos al formData
  useEffect(() => {
    if (isEdit && property) {
      setFormData(prev => ({
        ...prev,
        ...property,
        propertyId: property.propertyId || "",
        files: [], // Opcional: puedes mapear aquí archivos existentes para previews
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, property]);

  const router = useRouter();
  const { user } = useKindeBrowserClient();

  const validateStep = (): Record<string, string> => {
    let parsed;

    switch (step) {
      case 0:
        parsed = AddPropertyFormSchema.pick({
          propertyId: true,
          title: true,
          price: true,
          videoUrl: true,
          propertyTypeId: true,
          statusId: true,
        }).safeParse(formData);
        break;
      case 1:
        parsed = AddPropertyFormSchema.pick({
          stateId: true,
          cityId: true,
          zipCode: true,
          urlGoogleMaps: true,
        }).safeParse(formData);
        break;
      default:
        return {};
    }

    if (!parsed.success) {
      const errorMap: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errorMap[field] = issue.message;
      });
      return errorMap;
    }

    return {};
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateStep();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }
    setFieldErrors({});
    setStep((prev) => prev + 1);
  };

  const handlePrev = () => {
    setFieldErrors({});
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullValidation = AddPropertyFormSchema.safeParse(formData);
    if (!fullValidation.success) {
      const errorMap: Record<string, string> = {};
      fullValidation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errorMap[field] = issue.message;
      });
      setFieldErrors(errorMap);
      return;
    }

    if (!user || !user.id) {
      setFieldErrors({ general: "No se pudo obtener el ID del usuario. Por favor, vuelve a iniciar sesión." });
      return;
    }

    try {
      const uploadedUrls = formData.files.length > 0
        ? await uploadToS3(formData.files)
        : [];

      await saveProperty(
        { ...fullValidation.data, propertyId: formData.propertyId },
        uploadedUrls,
        user.id,
        isEdit // <-- Solo esto, el resto igual
      );

      toast.success(isEdit ? "Propiedad actualizada exitosamente" : "Propiedad guardada exitosamente");

      router.push("/user/properties");
    } catch (err) {
      console.error("Submission error", err);
      setFieldErrors({ general: "Error al guardar la propiedad." });
      toast.error("Error al guardar la propiedad. Por favor, inténtalo de nuevo más tarde.");
    }
  };


  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <Stepper items={steps} activeItem={step} setActiveItem={setStep} className="mb-8" />

      <div className="bg-content1 p-6 rounded-xl shadow-lg">
        <Form
          className="flex flex-col gap-6"
          onSubmit={step < steps.length - 1 ? handleNext : handleSubmit}
        >
          {step === 0 && (
            <Basic
              formData={formData}
              setFormData={setFormData}
              types={types}
              statuses={statuses}
              providers={providers}
              ranges={ranges}
              illuminations={illuminations}
              conditions={conditions}
              demands={demands}
              accesibilities={accesibilities}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
            />
          )}

          {step === 1 && (
            <Location
              formData={formData}
              setFormData={setFormData}
              states={states}
              fieldErrors={fieldErrors}
              setFieldErrors={setFieldErrors}
            />
          )}

          {step === 2 && (
            <Details
              formData={formData}
              setFormData={setFormData}
              fieldErrors={fieldErrors}
            />
          )}

          {step === 3 && (
            <FilesStep
              formData={formData}
              setFormData={setFormData}
              fieldErrors={fieldErrors}
            />
          )}

          {step === 4 && <Review formData={formData} states={states} />}

          {Object.keys(fieldErrors).length > 0 && (
            <div className="text-danger text-sm">
              {Object.values(fieldErrors)[0]}
            </div>
          )}

          <div className="w-full flex justify-between mt-6">
            {step > 0 && (
              <Button variant="flat" color="default" onClick={handlePrev} type="button">
                Atrás
              </Button>
            )}
            <Button color={step === steps.length - 1 ? "success" : "secondary"} type="submit">
              {step === steps.length - 1 ? (isEdit ? "Actualizar" : "Enviar") : "Siguiente"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}