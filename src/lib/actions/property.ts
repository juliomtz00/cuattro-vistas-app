"use server";

import { AddPropertyInputType } from "@/app/user/properties/add/_components/AddPropertyForm";
import prisma from "../prisma";

export async function saveProperty(
  propertyData: AddPropertyInputType,
  imageUrls: string[],
  userId: string
) {
  try {
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
            value: "auto", // required by your schema, consider adjusting if needed
          },
        },

        location: {
          create: {
            address: propertyData.address,
            zipCode: propertyData.zipCode ? Number(propertyData.zipCode) : null,
            urlGoogleMaps: propertyData.urlGoogleMaps,
            cityId: parseInt(propertyData.cityId),
            value: "auto", // required by your schema, consider adjusting if needed
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
  } catch (error) {
    console.error("Failed to create property:", error);
    throw new Error("No se pudo guardar la propiedad.");
  }
}
