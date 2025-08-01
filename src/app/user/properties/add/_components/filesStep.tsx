import React from "react";
import { Button, Input } from "@heroui/react";
import { PropertyFormData } from "@/types/propertyForm";

interface FilesStepProps {
  formData: PropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<PropertyFormData>>;
  fieldErrors: Record<string, string>;
}

const FilesStep: React.FC<FilesStepProps> = ({ formData, setFormData, fieldErrors }) => {
  const handleFileRemove = (index: number) => {
    const updatedFiles = formData.files.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, files: updatedFiles }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500">
        Sube las imágenes o documentos relacionados con la propiedad. Puedes seleccionar varios archivos.
      </p>

      <Input
        type="file"
        multiple
        label="Archivos"
        onChange={handleFileChange}
        className="w-full"
        isInvalid={!!fieldErrors.files}
        errorMessage={fieldErrors.files}
      />

      {formData.files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold mb-2">Archivos seleccionados:</p>
          <ul className="flex flex-wrap gap-4">
            {formData.files.map((file, index) => (
              <li key={index} className="flex flex-col items-center gap-2">
                <div className="text-sm text-gray-700 text-center max-w-[120px] truncate">
                  {file.name}
                </div>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onClick={() => handleFileRemove(index)}
                >
                  Eliminar
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilesStep;