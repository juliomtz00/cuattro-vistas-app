// app/user/properties/_components/PropertiesTable.tsx

"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  properties: Prisma.PropertyGetPayload<{
    include: {
      type: true;
      status: true;
      user: true;
    };
  }>[];
  totalPages: number;
  currentPage: number;
};

const PropertiesTable = ({ properties, totalPages, currentPage }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-4 w-full min-h-fit">
      <Table aria-label="User properties table" className="w-full">
        <TableHeader>
          <TableColumn>TÍTULO</TableColumn>
          <TableColumn>PRECIO</TableColumn>
          <TableColumn>TIPO</TableColumn>
          <TableColumn>ESTATUS</TableColumn>
          <TableColumn>AÑADIDO POR</TableColumn>
          <TableColumn>ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell>{property.title}</TableCell>
              <TableCell>${property.price.toLocaleString()}</TableCell>
              <TableCell>{property.type.value}</TableCell>
              <TableCell>{property.status.value}</TableCell>
              <TableCell>
                {property.user.username}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Tooltip content="Ver">
                    <Link href={`/property/${property.id}`}>
                      <EyeIcon className="w-5 text-gray-600" />
                    </Link>
                  </Tooltip>
                  <Tooltip content="Editar" color="warning">
                    <Link href={`/user/properties/${property.id}/edit`}>
                      <PencilIcon className="w-5 text-yellow-600" />
                    </Link>
                  </Tooltip>
                  <Tooltip content="Eliminar" color="danger">
                    <Link href={`/user/properties/${property.id}/delete`}>
                      <TrashIcon className="w-5 text-red-600" />
                    </Link>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        total={totalPages}
        page={currentPage}
        initialPage={1}
        onChange={(page) => router.push(`/user/properties?pagenum=${page}`)}
      />
    </div>
  );
};

export default PropertiesTable;
