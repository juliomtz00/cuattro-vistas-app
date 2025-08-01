// app/user/properties/page.tsx

import prisma from "@/lib/prisma";
import PropertiesTable from "./_components/PropertiesTable";

const PAGE_SIZE = 12;

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PropertiesPage = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams;
  const rawPageNum = resolvedParams.pagenum;
  const pagenum = rawPageNum && !Array.isArray(rawPageNum) ? parseInt(rawPageNum) : 0;

  const [properties, totalProperties] = await Promise.all([
    prisma.property.findMany({
      include: {
        type: true,
        status: true,
        user: true,
      },
      skip: pagenum * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.property.count(),
  ]);

  const totalPages = Math.ceil(totalProperties / PAGE_SIZE);

  return (
    <PropertiesTable
      properties={properties}
      totalPages={totalPages}
      currentPage={pagenum}
    />
  );
};

export default PropertiesPage;
