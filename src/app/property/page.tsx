export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { Prisma } from "@/generated/prisma"; // or '@prisma/client' if that's your client path
import PropertyFilter, { PropertySearchParams } from "./_components/PropertyFilter";
import PropertyList from "./_components/PropertyList";

// --- 1. Define your filtering logic ---
function buildPropertyWhere(params: PropertySearchParams = {}): Prisma.PropertyWhereInput {
  const {
    state,
    city,
    zip,
    priceMin,
    priceMax,
    bedrooms,
    bathrooms,
    status,
    type,
    parking,
    maxAge,
    propertyRange,
    // ...add more if needed
  } = params;

  const where: Prisma.PropertyWhereInput = {};

  if (type) where.propertyTypeId = Number(type);
  if (status) where.statusId = Number(status);
  if (propertyRange) where.propertyTypeId = Number(propertyRange);
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) {
      (where.price as Prisma.FloatFilter).gte = Number(priceMin);
    }
    if (priceMax) {
      (where.price as Prisma.FloatFilter).lte = Number(priceMax);
    }
  }

  // Nested location filter
  if (state || city || zip) {
    where.location = { AND: [] };
    if (state) (where.location.AND as any[]).push({ city: { stateId: Number(state) } });
    if (city) (where.location.AND as any[]).push({ cityId: Number(city) });
    if (zip) (where.location.AND as any[]).push({ zipCode: Number(zip) });
  }

  // Nested features filter
  if (bedrooms || bathrooms || parking || maxAge) {
    where.features = { AND: [] };
    if (bedrooms) (where.features.AND as any[]).push({ bedrooms: Number(bedrooms) });
    if (bathrooms) (where.features.AND as any[]).push({ bathrooms: Number(bathrooms) });
    if (parking) (where.features.AND as any[]).push({ parking: Number(parking) });
    if (maxAge) (where.features.AND as any[]).push({ age: { lte: Number(maxAge) } });
  }

  // ...add more filters as needed

  return where;
}

// --- 2. Main page component ---
export default async function PropertiesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Convert searchParams to flat strings
  const typedParams: PropertySearchParams = {};
  const params = searchParams ? await searchParams : {};
Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string") typedParams[key as keyof PropertySearchParams] = value;
    else if (Array.isArray(value)) typedParams[key as keyof PropertySearchParams] = value[0] as string;
  });

  // Fetch dropdown data
  const [states, types, statuses, ranges] = await Promise.all([
    prisma.state.findMany({ include: { cities: true }, orderBy: { name: "asc" } }),
    prisma.propertyType.findMany({ orderBy: { value: "asc" } }),
    prisma.propertyStatus.findMany({ orderBy: { value: "asc" } }),
    prisma.propertyRange.findMany({orderBy: { value: "asc" } })
  ]);

  // Build filter object
  const where = buildPropertyWhere(typedParams);

  // Fetch properties
  const properties = await prisma.property.findMany({
    where,
    include: {
      images: true,
      type: true,
      status: true,
      location: { include: { city: { include: { state: true } } } },
      features: true,
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="min-h-screen">
      <section className="px-6 py-10">
        <PropertyFilter
          states={states}
          types={types}
          statuses={statuses}
          ranges={ranges}
          initialParams={typedParams}
        />
        <PropertyList properties={properties} />
      </section>
    </main>
  );
}
