// src/app/property/[id]/page.tsx
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyDetailClient from "./PropertyDetailClient";

// You can remove the PropertyPageProps interface definition if you use 'any' directly below
// interface PropertyPageProps {
//   params: Promise<{ id: string }> | { id: string };
// }

export default async function PropertyPage({
  params,
}: {
  params: any; // <--- CHANGE THIS LINE TO 'any'
}) {
  // *** IMPORTANT: Still await params for runtime safety ***
  // Even with 'any', Next.js expects params to be awaited if it's an async value.
  const resolvedParams = await params;

  // You can cast resolvedParams back to its expected type for internal type safety
  const idParam: { id: string } = resolvedParams;

  const property = await prisma.property.findUnique({
    where: { id: parseInt(idParam.id, 10) }, // Use idParam.id
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