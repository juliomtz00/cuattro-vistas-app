"use client";
import React from "react";
import { User } from "@/generated/prisma";

interface SectionTitleProps {
  user: User;
}

const SectionTitle = ({ user }: SectionTitleProps) => {
  const displayItems = [
    {
      label: "Nombre de usuario",
      value: `@${user.username}`,
    },
    {
      label: "Correo electrónico",
      value: user.email,
    },
    {
      label: "Fecha de creación",
      value: new Date(user.createdAt).toLocaleDateString("es-MX"),
    },
  ];

  return (
    <section className="py-10 w-full">
      <div className="max-w-2xl mx-auto px-4 sm:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center shadow-lg mb-5">
            <span className="text-4xl font-bold text-primary-700 select-none">
              {user.firstName[0]}
            </span>
          </div>
          {/* Name */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 font-manrope">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-base text-gray-500 leading-6">
            Este es tu perfil registrado en la plataforma.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-primary/10 shadow-xl p-6 flex flex-col gap-7">
          {displayItems.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="text-lg font-semibold text-blue-700">{item.value}</div>
              <span className="text-xs text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionTitle;
