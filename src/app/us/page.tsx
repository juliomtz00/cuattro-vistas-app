// app/us/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function UsPage() {
  return (
    <section className="py-4 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-10 items-center">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-10 items-center lg:items-start">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-3 w-full">
                <h2 className="text-secondary text-4xl font-bold leading-normal lg:text-start text-center">
                  El camino de Cuattro Vistas
                </h2>
                <p className="text-gray-500 text-base leading-relaxed lg:text-start text-center">
                  En Cuattro Vistas, somos una empresa familiar 100% mexicana dedicada a la asesoría, comercialización y administración inmobiliaria. Nuestro objetivo es ayudarte a encontrar tu nuevo hogar o inversión con transparencia, profesionalismo y un trato personalizado.
                </p>
              </div>
            </div>

            {/* Numbers/Stats */}
            <div className="flex flex-col gap-6 w-full">
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8 w-full">
                <div className="p-4 rounded-xl border border-gray-200 hover:border-primary transition flex flex-col gap-2.5">
                  <h4 className="text-secondary text-2xl font-bold">+20 años</h4>
                  <p className="text-gray-500 text-base">Trayectoria en el sector inmobiliario</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 hover:border-primary transition flex flex-col gap-2.5">
                  <h4 className="text-secondary text-2xl font-bold">+100 operaciones</h4>
                  <p className="text-gray-500 text-base">Clientes y familias satisfechas</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-8 w-full">
                <div className="p-4 rounded-xl border border-gray-200 hover:border-primary transition flex flex-col gap-2.5">
                  <h4 className="text-secondary text-2xl font-bold">Atención personalizada</h4>
                  <p className="text-gray-500 text-base">Nos enfocamos en tus necesidades y acompañamos todo el proceso</p>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 hover:border-primary transition flex flex-col gap-2.5">
                  <h4 className="text-secondary text-2xl font-bold">Confianza y ética</h4>
                  <p className="text-gray-500 text-base">Transparencia en cada operación</p>
                </div>
              </div>
            </div>

            <Link href="/contact" className="sm:w-fit w-full group px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg shadow transition flex items-center justify-center gap-2 mt-6">
              <span className="font-medium">Contáctanos</span>
              <svg className="group-hover:translate-x-1 transition" xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" viewBox="0 0 18 18">
                <path d="M6.75 4.5L11.25 9l-4.5 4.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>

          {/* RIGHT SIDE - Image */}
          <div className="w-full flex justify-center items-center">
            <div className="pb-6 sm:w-[500px] w-full sm:h-[580px] h-full bg-gray-100 rounded-3xl relative shadow">
              <Image
                className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                src="/banner.jpg" // Put your team or office image in public/about-hero.jpg
                alt="Equipo Cuattro Vistas"
                width={500}
                height={580}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
