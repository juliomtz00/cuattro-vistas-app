'use client';

import { Button } from '@heroui/react';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import ImportCSV from './_components/importCSV';

interface PropertiesLayoutProps {
  children: React.ReactNode;
}

const PropertiesLayout: React.FC<PropertiesLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();

  const isAddPage = pathname === '/user/properties/add';

  const handleClick = () => {
    if (isAddPage) {
      router.push('/user/properties'); // Go back to the properties list
    } else {
      router.push('/user/properties/add'); // Go to add property form
    }
  };

  return (
    <div className='p-6 sm:p-4 flex-grow'>
      <div className="bg-background flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 pb-6">
        <h2 className="text-2xl font-bold flex-shrink-0 text-center sm:text-left">Lista de Propiedades</h2>
        <div className="flex flex-col sm:flex-row sm:flex-nowrap gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
          <ImportCSV />
          <Button
            onClick={handleClick}
            className={
              isAddPage
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-secondary text-white font-semibold'
            }
          >
            {isAddPage ? 'Cancelar' : 'Añadir Propiedad'}
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default PropertiesLayout;
