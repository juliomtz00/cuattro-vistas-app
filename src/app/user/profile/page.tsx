import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { getUserById } from '@/lib/actions/user';
import PageTitle from '@/app/components/pageTitle';
import React from 'react';

// Define the shape of the user object as it comes from the database.
// This is likely what getUserById returns without any includes.
type DbUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
};

// Define the type for the user object when it includes the 'properties' relation.
// This matches the data structure your component is trying to access.
type UserWithProperties = DbUser & {
  properties: { id: number }[]; // We only need the id to count them
};

export default async function ProfilePage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return <div className="text-red-500 text-center mt-10">No estás autenticado</div>;
  }

  // Get the user from the database.
  // We'll cast the result to our more specific type.
  // You must ensure that the getUserById function itself includes the properties:
  // e.g., prisma.user.findUnique({ where: { id: userId }, include: { properties: true }})
  const dbUser = await getUserById(user.id) as UserWithProperties | null;

  if (!dbUser) {
    return <div className="text-red-500 text-center mt-10">Usuario no encontrado</div>;
  }

  return (
    <>
      <PageTitle title="Perfil de Usuario" linkCaption="← Regresar" href="/" />
      <section className="py-12 sm:py-20">
        <div className="mx-auto px-4 sm:px-8">
          <div className="rounded-2xl py-10 px-6 sm:px-10 bg-gray-50 flex flex-col items-center gap-10 shadow-xl">
            <div className="w-full flex flex-col items-center gap-2">
              <h2 className="font-manrope text-3xl font-bold text-gray-900">{dbUser.firstName} {dbUser.lastName}</h2>
              <span className="text-gray-500 text-base">@{dbUser.username}</span>
              <span className="text-gray-400 text-sm">{dbUser.email}</span>
            </div>
            <div className="w-full flex flex-col gap-6">
              <ProfileStat
                label="Miembro desde"
                value={new Date(dbUser.createdAt).toLocaleDateString("es-MX")}
              />
              <ProfileStat
                label="Propiedades Creadas"
                value={dbUser.properties?.length || 0}
              />
              {/* Add more stats or info as needed */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ProfileStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="font-manrope font-bold text-2xl text-blue-600 mb-1 text-center">{value}</div>
      <span className="text-gray-700 text-center">{label}</span>
    </div>
  );
}