
import { jsPDF as JsPDFType } from "jspdf";
import autoTable, { UserOptions, CellHookData } from "jspdf-autotable";

// ----- TYPES -----
interface PropertyImage {
  url: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface PropertyType {
  value: string;
}

interface PropertyStatus {
  value: string;
}

interface Provider {
  value: string;
}

interface State {
  name: string;
}

interface City {
  name: string;
  state?: State;
}

interface PropertyLocation {
  address?: string;
  zipCode?: number;
  urlGoogleMaps?: string;
  city?: City;
}

interface PropertyFeature {
  bedrooms?: number;
  bathrooms?: number;
  halfBathrooms?: number;
  parking?: number;
  terrainM2?: number;
  constructionM2?: number;
  levels?: number;
  age?: number;
  balcon?: boolean;
  pool?: boolean;
  furnished?: boolean;
  downtown?: boolean;
  acceptsCreditBank?: boolean;
  acceptsCreditSocial?: boolean;
  connectivity?: string;
  greenAreas?: string;
}

export interface Property {
  title?: string;
  price?: number;
  type?: PropertyType | null;
  status?: PropertyStatus | null;
  provider?: Provider | null;
  user?: User | null;
  images: PropertyImage[];
  features?: PropertyFeature | null;
  location?: PropertyLocation | null;
  description?: string;
  videoUrl?: string;
}

// Allow lastAutoTable
interface jsPDFWithAutoTable extends JsPDFType {
  lastAutoTable?: {
    finalY: number;
  };
}

async function loadImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

// ----- MAIN FUNCTION -----
export async function generatePropertyPDF(property: Property) {
  const doc = new JsPDFType("p", "mm", "a4") as jsPDFWithAutoTable;
  let y = 15;

  const logoBase64 = await loadImageAsBase64("/logo-cuattrovistas.png");
  doc.addImage(logoBase64, "PNG", 15, 10, 40, 18, undefined, "FAST");
  y = 40;

  doc.setFontSize(20);
  doc.text(property.title ?? "Propiedad", 15, y);
  y += 10;

  // Add up to 2 images
  if (property.images && property.images.length) {
    const loadImage = async (url: string) => {
      return await fetch(url)
        .then((r) => r.blob())
        .then(
          (blob) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            })
        );
    };

    const maxImages = 2;
    let x = 15;
    for (let i = 0; i < Math.min(property.images.length, maxImages); i++) {
      const base64 = await loadImage(property.images[i].url);
      doc.addImage(base64, "JPEG", x, y, 60, 45, undefined, "FAST");
      x += 70;
    }
    y += 50;
  }

  doc.setFontSize(14);
  doc.text("Ficha Técnica", 15, y);
  y += 7;

  // General Info Table
  autoTable(doc, {
    startY: y,
    theme: "grid",
    head: [["Información Básica", ""]],
    body: [
      ["Precio", property.price ? `$${property.price.toLocaleString()}` : "-"],
      ["Tipo", property.type?.value ?? "-"],
      ["Estatus", property.status?.value ?? "-"],
      ["Proveedor", property.provider?.value ?? "-"],
      ["Usuario", property.user ? `${property.user.firstName} ${property.user.lastName}` : "-"],
      ["Correo Usuario", property.user?.email ?? "-"],
    ],
    styles: { fontSize: 11 },
    headStyles: { fillColor: [128, 174, 190] },
  } as UserOptions);

  // Features Table
  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 2 : y + 40,
    theme: "grid",
    head: [["Características", ""]],
    body: [
      ["Recámaras", property.features?.bedrooms],
      ["Baños", property.features?.bathrooms],
      ["Medios Baños", property.features?.halfBathrooms],
      ["Estacionamientos", property.features?.parking],
      ["Terreno (m²)", property.features?.terrainM2],
      ["Construcción (m²)", property.features?.constructionM2],
      ["Niveles", property.features?.levels],
      ["Antigüedad", property.features?.age],
      ["Balcón", property.features?.balcon ? "Sí" : undefined],
      ["Alberca", property.features?.pool ? "Sí" : undefined],
      ["Amueblado", property.features?.furnished ? "Sí" : undefined],
      ["Zona céntrica", property.features?.downtown ? "Sí" : undefined],
      ["Crédito Bancario", property.features?.acceptsCreditBank ? "Aceptado" : undefined],
      ["Crédito INFONAVIT/FOVISSSTE", property.features?.acceptsCreditSocial ? "Aceptado" : undefined],
      ["Conectividad", property.features?.connectivity],
      ["Áreas verdes", property.features?.greenAreas],
    ].filter((item) => item[1] !== undefined && item[1] !== null && item[1] !== ""),
    styles: { fontSize: 11 },
    headStyles: { fillColor: [128, 174, 190] },
  } as UserOptions);

  // Location Table
  autoTable(doc, {
    startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 2 : y + 60,
    theme: "grid",
    head: [["Ubicación", ""]],
    body: [
      ["Estado", property.location?.city?.state?.name],
      ["Ciudad", property.location?.city?.name],
      ["Dirección", property.location?.address],
      ["Código Postal", property.location?.zipCode?.toString()],
      [
        "Google Maps",
        property.location?.urlGoogleMaps
          ? property.location.urlGoogleMaps
          : undefined,
      ],
    ].filter((item) => item[1]),
    styles: { fontSize: 11 },
    headStyles: { fillColor: [128, 174, 190] },
    didDrawCell: (data: CellHookData) => {
      if (
        data.column.index === 1 &&
        typeof data.cell.raw === "string" &&
        data.cell.raw.startsWith("http")
      ) {
        doc.setTextColor(32, 87, 190);
        doc.textWithLink("Ver ubicación", data.cell.x + 2, data.cell.y + 5, {
          url: data.cell.raw,
        });
        doc.setTextColor(0, 0, 0);
      }
    },
  } as UserOptions);

  // Description
  if (property.description) {
    doc.setFontSize(12);
    doc.text("Descripción:", 15, doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 250);
    doc.setFontSize(11);
    doc.text(
      doc.splitTextToSize(property.description, 180),
      15,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 17 : 257
    );
  }

  // Video link
  if (property.videoUrl) {
    doc.setTextColor(32, 87, 190);
    doc.textWithLink(
      "Ver video",
      15,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 30 : 270,
      { url: property.videoUrl }
    );
    doc.setTextColor(0, 0, 0);
  }

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(180, 180, 180);
  doc.text(
    "© Cuattro Vistas 2025 - Documento generado automáticamente.",
    15,
    290
  );

  doc.save(`FichaTécnica_cuattrovistas_${property.title}.pdf`);
}
