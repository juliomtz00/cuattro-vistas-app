"use server";

import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";

export async function saveProperty(
  propertyData: AddPropertyInputType,
  imageUrls: string[],
  userId: string,
  isEdit?: boolean // <--- Nuevo argumento
) {
  try {
    if (isEdit && propertyData.propertyId) {
      // === MODO EDICIÓN ===
      const updated = await prisma.property.update({
        where: {
          propertyId: propertyData.propertyId,
        },
        data: {
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          availability: propertyData.availability,
          videoUrl: propertyData.videoUrl || null,
          propertyTypeId: parseInt(propertyData.propertyTypeId),
          statusId: parseInt(propertyData.statusId),
          providerId: propertyData.providerId || null,
          propertyRangeId: propertyData.propertyRangeId ? parseInt(propertyData.propertyRangeId) : null,
          illuminationId: propertyData.illuminationId ? parseInt(propertyData.illuminationId) : null,
          propertyConditionId: propertyData.propertyConditionId ? parseInt(propertyData.propertyConditionId) : null,
          zoneDemandId: propertyData.zoneDemandId ? parseInt(propertyData.zoneDemandId) : null,
          accesibilityId: propertyData.accesibilityId ? parseInt(propertyData.accesibilityId) : null,

          // --- FEATURES (1:1, usa upsert) ---
          features: {
            upsert: {
              update: {
                bedrooms: Number(propertyData.bedrooms) || 0,
                bathrooms: Number(propertyData.bathrooms) || 0,
                halfBathrooms: Number(propertyData.halfBathrooms) || 0,
                balcon: propertyData.balcon,
                pool: propertyData.pool,
                furnished: propertyData.furnished,
                downtown: propertyData.downtown,
                terrainM2: Number(propertyData.terrainM2) || 0,
                constructionM2: Number(propertyData.constructionM2) || 0,
                levels: Number(propertyData.levels) || 0,
                parking: Number(propertyData.parking) || 0,
                acceptsCreditBank: propertyData.acceptsCreditBank,
                acceptsCreditSocial: propertyData.acceptsCreditSocial,
                age: Number(propertyData.age) || 0,
                connectivity: propertyData.connectivity,
                greenAreas: propertyData.greenAreas,
                value: "auto",
              },
              create: {
                bedrooms: Number(propertyData.bedrooms) || 0,
                bathrooms: Number(propertyData.bathrooms) || 0,
                halfBathrooms: Number(propertyData.halfBathrooms) || 0,
                balcon: propertyData.balcon,
                pool: propertyData.pool,
                furnished: propertyData.furnished,
                downtown: propertyData.downtown,
                terrainM2: Number(propertyData.terrainM2) || 0,
                constructionM2: Number(propertyData.constructionM2) || 0,
                levels: Number(propertyData.levels) || 0,
                parking: Number(propertyData.parking) || 0,
                acceptsCreditBank: propertyData.acceptsCreditBank,
                acceptsCreditSocial: propertyData.acceptsCreditSocial,
                age: Number(propertyData.age) || 0,
                connectivity: propertyData.connectivity,
                greenAreas: propertyData.greenAreas,
                value: "auto",
              },
            },
          },

          // --- LOCATION (1:1, usa upsert) ---
          location: {
            upsert: {
              update: {
                address: propertyData.address,
                zipCode: propertyData.zipCode ? Number(propertyData.zipCode) : null,
                urlGoogleMaps: propertyData.urlGoogleMaps,
                cityId: parseInt(propertyData.cityId),
                value: "auto",
              },
              create: {
                address: propertyData.address,
                zipCode: propertyData.zipCode ? Number(propertyData.zipCode) : null,
                urlGoogleMaps: propertyData.urlGoogleMaps,
                cityId: parseInt(propertyData.cityId),
                value: "auto",
              },
            },
          },

          // --- IMAGES (1:N, usa deleteMany + create) ---
          images: {
            deleteMany: {}, // Borra todas las imágenes anteriores
            create: imageUrls.map((url) => ({ url })),
          },
        },
      });

      console.log("Updated property:", updated);
      return updated;
    } else {
      // === MODO CREAR ===
      const result = await prisma.property.create({
        data: {
          propertyId: propertyData.propertyId,
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          userId,
          availability: propertyData.availability,
          videoUrl: propertyData.videoUrl || null,
          propertyTypeId: parseInt(propertyData.propertyTypeId),
          statusId: parseInt(propertyData.statusId),
          providerId: propertyData.providerId || null,
          propertyRangeId: propertyData.propertyRangeId ? parseInt(propertyData.propertyRangeId) : null,
          illuminationId: propertyData.illuminationId ? parseInt(propertyData.illuminationId) : null,
          propertyConditionId: propertyData.propertyConditionId ? parseInt(propertyData.propertyConditionId) : null,
          zoneDemandId: propertyData.zoneDemandId ? parseInt(propertyData.zoneDemandId) : null,
          accesibilityId: propertyData.accesibilityId ? parseInt(propertyData.accesibilityId) : null,
          features: {
            create: {
              bedrooms: Number(propertyData.bedrooms) || 0,
              bathrooms: Number(propertyData.bathrooms) || 0,
              halfBathrooms: Number(propertyData.halfBathrooms) || 0,
              balcon: propertyData.balcon,
              pool: propertyData.pool,
              furnished: propertyData.furnished,
              downtown: propertyData.downtown,
              terrainM2: Number(propertyData.terrainM2) || 0,
              constructionM2: Number(propertyData.constructionM2) || 0,
              levels: Number(propertyData.levels) || 0,
              parking: Number(propertyData.parking) || 0,
              acceptsCreditBank: propertyData.acceptsCreditBank,
              acceptsCreditSocial: propertyData.acceptsCreditSocial,
              age: Number(propertyData.age) || 0,
              connectivity: propertyData.connectivity,
              greenAreas: propertyData.greenAreas,
              value: "auto",
            },
          },
          location: {
            create: {
              address: propertyData.address,
              zipCode: propertyData.zipCode ? Number(propertyData.zipCode) : null,
              urlGoogleMaps: propertyData.urlGoogleMaps,
              cityId: parseInt(propertyData.cityId),
              value: "auto",
            },
          },
          images: {
            create: imageUrls.map((url) => ({
              url,
            })),
          },
        },
      });

      console.log("Created property:", result);
      return result;
    }
  } catch (error) {
    console.error(isEdit ? "Failed to update property:" : "Failed to create property:", error);
    throw new Error("No se pudo guardar la propiedad.");
  }
}

// Asegúrate que recibe el id correcto (number o string según tu modelo)
export async function deleteProperty(id: number | string) {
  try {
    // Si usas propertyId único:
    // await prisma.property.delete({ where: { propertyId: String(id) } });
    // Si usas id autoincrement:
    await prisma.property.delete({ where: { id: typeof id === "string" ? parseInt(id) : id } });
  } catch (error) {
    console.error("Failed to delete property:", error);
    throw new Error("No se pudo eliminar la propiedad.");
  }
}