import prisma from "@/lib/prisma";
import AddPropertyForm from "../../add/_components/AddPropertyForm";
import { notFound, redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// 👇 Ajusta el type si tus IDs son string o number
interface Props {
  params: { id: string };
}

const EditPropertyPage = async ({ params }: Props) => {
  // Cargar los catálogos necesarios
  const [
    types,
    statuses,
    states,
    providers,
    ranges,
    illuminations,
    conditions,
    demands,
    accesibilities,
    property
  ] = await Promise.all([
    prisma.propertyType.findMany(),
    prisma.propertyStatus.findMany(),
    prisma.state.findMany({
      include: { cities: true },
    }),
    prisma.provider.findMany(),
    prisma.propertyRange.findMany(),
    prisma.illumination.findMany(),
    prisma.propertyCondition.findMany(),
    prisma.zoneDemand.findMany(),
    prisma.accesibility.findMany(),
    prisma.property.findUnique({
        where: { id: +params.id },
        include: {
            location: {
            include: {
                city: {
                include: {
                    state: true
                }
                }
            }
            },
            features: true,
            images: true,
        },
        })
  ]);

  // Obtener usuario autenticado
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  // Validaciones de acceso
  if (!property) return notFound();
  if (!user || property.userId !== user.id) redirect("/unauthorized");

  const propertyForForm = property && {
    propertyId: property.propertyId || property.id?.toString() || "",
    title: property.title || "",
    description: property.description || "",
    price: property.price?.toString() || "",
    availability: property.availability ?? true,
    videoUrl: property.videoUrl || "",
    propertyTypeId: property.propertyTypeId?.toString() || "",
    statusId: property.statusId?.toString() || "",
    providerId: property.providerId?.toString() || "",
    propertyRangeId: property.propertyRangeId?.toString() || "",
    illuminationId: property.illuminationId?.toString() || "",
    propertyConditionId: property.propertyConditionId?.toString() || "",
    zoneDemandId: property.zoneDemandId?.toString() || "",
    accesibilityId: property.accesibilityId?.toString() || "",
    // Location
    stateId: property.location?.city?.stateId?.toString() || "",
    cityId: property.location?.cityId?.toString() || "",
    address: property.location?.address || "",
    zipCode: property.location?.zipCode?.toString() || "",
    urlGoogleMaps: property.location?.urlGoogleMaps || "",
    // Features
    bedrooms: property.features?.bedrooms?.toString() || "",
    bathrooms: property.features?.bathrooms?.toString() || "",
    halfBathrooms: property.features?.halfBathrooms?.toString() || "",
    balcon: !!property.features?.balcon,
    pool: !!property.features?.pool,
    furnished: !!property.features?.furnished,
    downtown: !!property.features?.downtown,
    terrainM2: property.features?.terrainM2?.toString() || "",
    constructionM2: property.features?.constructionM2?.toString() || "",
    levels: property.features?.levels?.toString() || "",
    parking: property.features?.parking?.toString() || "",
    acceptsCreditBank: !!property.features?.acceptsCreditBank,
    acceptsCreditSocial: !!property.features?.acceptsCreditSocial,
    age: property.features?.age?.toString() || "",
    connectivity: property.features?.connectivity || "",
    greenAreas: property.features?.greenAreas || "",
    files: [],
  };


  // Renderizar el formulario en modo edición
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
        property={propertyForForm}
        isEdit={true}
    />
    );
};

export default EditPropertyPage;
