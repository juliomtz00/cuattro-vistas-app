import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

interface Props {
  params: { id: string };
}

export default async function PropertyPage({ params }: Props) {
  const property = await prisma.property.findUnique({
    where: { id: +params.id },
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

  // Cast for type safety (see notes above)
  return <PropertyDetailClient property={property} />;
}
