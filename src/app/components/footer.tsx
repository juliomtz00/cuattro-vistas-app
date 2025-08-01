"use client";

import { Link, Image } from "@heroui/react";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="pt-6 w-full space-y-8 px-4 py-12 sm:px-6 lg:space-y-16 lg:px-8">
        {/* Top section: Logo, description, social */}
        <div className="p-4 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Link href="/" className="block">
                <Image
                  src="/logo-cuattrovistas.png"
                  alt="Cuattro Vistas"
                  width={160}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <p className="mt-2 max-w-xs text-gray-500 text-sm">
              Especialistas en bienes raíces: venta, renta y administración.  
              Encuentra tu próxima propiedad en <span className="font-semibold text-primary">Cuattro Vistas</span>.
            </p>
          </div>

          {/* Info Columns */}
          <div className="flex flex-col items-start lg:col-span-2">
            <p className="font-bold text-gray-900 mb-4">Accesos Rápidos</p>
            <ul className="flex flex-wrap gap-10 text-sm">
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75">
                  Propiedades
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75">
                  Administración
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-700 transition hover:opacity-75">
                  Avalúos
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="text-xs p-6 text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Cuattro Vistas. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
