import prisma from "@/lib/prisma";
import { normalize, capitalizeFirst, formatZip } from "@/app/utils/normalize";

// Alias states, normalization
const ALIAS_ESTADOS: Record<string, string> = {
  "cdmx": "Ciudad de México",
  "ciudad de mexico": "Ciudad de México",
  "edomex": "Estado de México",
  "méxico": "Estado de México",
};

export function normalizeStateName(name: string) {
  const norm = normalize(name).toLowerCase();
  return ALIAS_ESTADOS[norm] || capitalizeFirst(name);
}
export function normalizeCityName(name: string) {
  return capitalizeFirst(normalize(name));
}
export function cleanValue(val: string) {
  return (val || "").toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// Main matching/validation logic. Returns an object { match, failedRow }
export async function matchAndPrepareProperty(obj: Record<string, string>, row: number) {
  // ---- Normalización de campos críticos (flexible)
  const rawState = cleanValue(obj.state);
  const stateName = normalizeStateName(rawState);
  const rawCity = cleanValue(obj.city);
  const cityName = normalizeCityName(rawCity);
  const propertyTypeName = capitalizeFirst(cleanValue(obj.propertyType));
  const statusName = capitalizeFirst(cleanValue(obj.status));
  const providerName = obj.provider ? capitalizeFirst(cleanValue(obj.provider)) : null;

  // State
  const state = await prisma.state.findFirst({ where: { name: { equals: stateName } } });
  if (!state) {
    const similar = await prisma.state.findMany({ where: { name: { contains: stateName.split(" ")[0] } } });
    return {
      failedRow: {
        row,
        field: "state",
        value: rawState,
        suggestions: similar.map(e => e.name),
        message: `No se encontró el estado "${rawState}".`,
        original: obj,
      },
    };
  }

  // City
  const city = await prisma.city.findFirst({
    where: {
      name: { equals: cityName },
      stateId: state.id
    }
  });
  if (!city) {
    const similar = await prisma.city.findMany({
      where: {
        name: { contains: cityName.slice(0, 4) },
        stateId: state.id
      }
    });
    return {
      failedRow: {
        row,
        field: "city",
        value: rawCity,
        state: state.name,
        suggestions: similar.map(c => c.name),
        message: `No se encontró la ciudad "${rawCity}" en "${state.name}".`,
        original: obj,
      },
    };
  }

  // PropertyType
  const propertyType = await prisma.propertyType.findFirst({ where: { value: { equals: propertyTypeName } } });
  if (!propertyType) {
    return {
      failedRow: {
        row,
        field: "propertyType",
        value: propertyTypeName,
        message: `No se encontró el tipo de propiedad "${propertyTypeName}".`,
        original: obj,
      },
    };
  }

  // Status
  const status = await prisma.propertyStatus.findFirst({ where: { value: { equals: statusName } } });
  if (!status) {
    return {
      failedRow: {
        row,
        field: "status",
        value: statusName,
        message: `No se encontró el estatus "${statusName}".`,
        original: obj,
      },
    };
  }

  // Provider (opcional)
  let provider = null;
  if (providerName) {
    provider = await prisma.provider.findFirst({ where: { value: providerName } });
    if (!provider) {
      provider = await prisma.provider.create({
        data: { value: providerName, id: providerName.replace(/\s/g, "_").toLowerCase() }
      });
    }
  }

  // ... (add lookup for auxiliary fields here if desired)

  // Return matched info for property creation
  return {
    match: {
      obj,
      state,
      city,
      propertyType,
      status,
      provider,
    },
  };
}

// Utility: actually creates the property in DB
export async function createPropertyInDB({ obj, state, city, propertyType, status, provider }: any) {
  return await prisma.property.create({
    data: {
      propertyId: obj.propertyId || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: obj.title || "",
      description: obj.description || "",
      price: obj.price ? Number(obj.price?.replace(/[^0-9.]/g, "")) : 0,
      userId: "admin", // TODO: set real user
      availability: ["sí", "si", "yes", "true"].includes((obj.availability || "").toLowerCase()),
      videoUrl: obj.videoUrl || undefined,
      propertyTypeId: propertyType.id,
      statusId: status.id,
      providerId: provider?.id || undefined,
      // Otros campos relacionales si los tienes...

      features: {
        create: {
          bedrooms: Number(obj.bedrooms) || 0,
          bathrooms: Number(obj.bathrooms) || 0,
          halfBathrooms: Number(obj.halfBathrooms) || 0,
          balcon: (obj.balcon || "").toLowerCase().startsWith("s"),
          pool: (obj.pool || "").toLowerCase().startsWith("s"),
          furnished: (obj.furnished || "").toLowerCase().startsWith("s"),
          downtown: (obj.downtown || "").toLowerCase().startsWith("s"),
          terrainM2: Number(obj.terrainM2) || 0,
          constructionM2: Number(obj.constructionM2) || 0,
          levels: Number(obj.levels) || 0,
          parking: Number(obj.parking) || 0,
          acceptsCreditBank: (obj.acceptsCreditBank || "").toLowerCase().startsWith("s"),
          acceptsCreditSocial: (obj.acceptsCreditSocial || "").toLowerCase().startsWith("s"),
          age: Number(obj.age) || 0,
          connectivity: obj.connectivity || "",
          greenAreas: obj.greenAreas || "",
          value: "auto",
        },
      },

      location: {
        create: {
          address: obj.address || "",
          zipCode: obj.zipCode ? Number(formatZip(obj.zipCode)) : undefined,
          urlGoogleMaps: obj.urlGoogleMaps || undefined,
          city: { connect: { id: city.id } },
          value: "auto",
        },
      },

      images: obj.images
        ? {
            create: obj.images
              .split(";")
              .map((url: string) => ({ url: url.trim() }))
              .filter((img: { url: string }) => img.url),
          }
        : undefined,
    },
  });
}
