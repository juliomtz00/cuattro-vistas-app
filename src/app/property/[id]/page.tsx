import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

export default async function PropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const property = await prisma.property.findUnique({
    where: { id: parseInt(params.id, 10) }, // parse to number if your id is number type
    include: {
      status: true,
      type: true,
      provider: true,
      location: { include: { city: { include: { state: true } } } },
      features: true,
      images: true,
      user: true,
    },
  });

  if (!property) return notFound();

  return <PropertyDetailClient property={property} />;
}