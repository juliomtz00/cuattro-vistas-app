import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const properties = await prisma.property.findMany({
    take: 6,
    include: {
      images: true,
      location: {
        include: {
          city: { include: { state: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-background flex flex-col w-full space-y-0">

      {/* HERO SECTION */}
      <section className="relative w-full flex flex-col items-center text-center min-h-screen justify-center overflow-hidden">
        <Image
          src="/imagen1.avif" // test with '/cuattro-vistas-mockup.png' or a .jpg to debug
          alt="Hero Cuattro Vistas"
          fill
          className="absolute inset-0 w-full h-fit object-cover z-0 pointer-events-none"
          priority
        />
        <div />
        <div className="relative z-20 w-full max-w-3xl mx-auto px-4 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-amber-100">
            Encuentra tu próxima <span className="text-">propiedad</span> en Cuattro Vistas
          </h1>
          <p className="max-w-2xl mx-auto text-white text-lg md:text-2xl mb-8 drop-shadow-xl font-medium">
            Vive el futuro de los bienes raíces: explora, compara y conecta con propiedades únicas en todo México.
          </p>
          <Link
            href="/property"
            className="items-center mt-auto self-start  px-4 py-2 rounded-xl bg-primary hover:bg-blue-100 text-white text-sm font-semibold"
          >
            Ver todas las propiedades
          </Link>
        </div>
      </section>



      {/* FEATURED PROPERTIES */}
      <section className="w-full bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 text-center">Propiedades Destacadas</h2>
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {properties.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-16">
                No hay propiedades disponibles en este momento.
              </div>
            ) : (
              properties.map((prop) => (
                <div key={prop.id} className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col">
                  <Link href={`/property/${prop.id}`}>
                    <Image
                      src={prop.images?.[0]?.url || "/default-property.jpg"}
                      alt={prop.title ?? "Propiedad"}
                      width={400}
                      height={250}
                      className="w-full h-48 md:h-56 object-cover transition"
                      priority
                    />
                  </Link>
                  <div className="p-4 md:p-5 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg mb-1 text-gray-800 truncate">{prop.title}</h3>
                    <p className="text-gray-500 mb-2 text-sm">
                      {prop.location?.city?.name || "Ciudad"}, {prop.location?.city?.state?.name || "Estado"}
                    </p>
                    <span className="font-bold text-blue-600 mb-4 text-lg">
                      {prop.price?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                    </span>
                    <Link
                      href={`/property/${prop.id}`}
                      className="mt-auto self-start px-4 py-2 rounded-xl bg-secondary hover:bg-blue-100 text-white text-sm font-semibold"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-8">
            <Link href="/property" className="text-secondary font-semibold hover:underline">Ver más propiedades</Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
          <div className="flex-1 space-y-4 md:space-y-5 mb-8 md:mb-0">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">¿Cómo funciona?</h3>
            <ul className="list-disc list-inside text-gray-600 text-base md:text-lg space-y-1 md:space-y-2">
              <li>Explora propiedades con filtros avanzados.</li>
              <li>Contacta fácilmente a los proveedores o agentes.</li>
              <li>Descarga fichas PDF personalizadas de cada propiedad.</li>
              <li>Marca propiedades como favoritas desde tu perfil, para acceder más tarde.</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <Image
              src="/banner.avif"
              alt="Mockup plataforma"
              width={350}
              height={260}
              className="rounded-2xl shadow-lg object-contain"
            />
          </div>
        </div>
      </section>

      {/* ABOUT/CTA */}
      <section className="py-12 w-full bg-secondary md:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl md:text-3xl font-bold text-white mb-3 md:mb-4">
            ¿Por qué Cuattro Vistas?
          </h3>
          <p className="text-base md:text-lg text-white mb-6 md:mb-8">
            Conecta con las mejores oportunidades inmobiliarias en México. Nuestro enfoque transparente y digital te da el control para encontrar tu próximo hogar o inversión sin complicaciones.
          </p>
          <Link
            href="/contact"
            className="mt-auto self-start px-4 py-2 rounded-xl bg-primary hover:bg-blue-100 text-white text-lg font-semibold"
          >
            Contacto
          </Link>
        </div>
      </section>
    </div>
  );
}
