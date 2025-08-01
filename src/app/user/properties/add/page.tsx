import { prisma } from "@/lib/prisma";
import AddPropertyForm from "./_components/AddPropertyForm";

export default async function AddPropertyPage() {
  const [types, statuses, states, providers, ranges, illuminations, conditions, demands, accesibilities] =
    await Promise.all([
      prisma.propertyType.findMany(),
      prisma.propertyStatus.findMany(),
      prisma.state.findMany({ include: { cities: true } }),
      prisma.provider.findMany(),
      prisma.propertyRange.findMany(),
      prisma.illumination.findMany(),
      prisma.propertyCondition.findMany(),
      prisma.zoneDemand.findMany(),
      prisma.accesibility.findMany(),
    ]);

  return (
    <AddPropertyForm
      types={types}
      statuses={statuses}
      states={states}
      providers={providers}
      ranges={ranges}
      illuminations={illuminations}
      conditions={conditions}
      demands={demands}
      accesibilities={accesibilities}
    />
  );
}
