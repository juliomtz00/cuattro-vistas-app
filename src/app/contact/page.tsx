// app/contact/page.tsx
import Image from "next/image";

export default function ContactPage() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          {/* LEFT: Info and image */}
          <div className="lg:mb-0 mb-10 relative">
            <div className="group w-full h-full">
              <div className="relative h-full">
                <Image
                  src="/contact-img.avif" // Save your contact image as public/contact-img.jpg
                  width={600}
                  height={500}
                  alt="Contacto Cuattro Vistas"
                  className="w-full h-full lg:rounded-l-2xl rounded-2xl object-cover"
                  priority
                />
                <h1 className="font-manrope text-white text-4xl font-bold leading-10 absolute top-11 left-11 drop-shadow">
                  Contáctanos
                </h1>
                <div className="absolute bottom-0 w-full lg:p-11 p-5">
                  <div className="bg-white rounded-lg p-6 block shadow">
                    <a href="tel:5551234567" className="flex items-center mb-6 group">
                      <svg width={30} height={30} viewBox="0 0 30 30" fill="none" className="shrink-0">
                        {/* (SVG as before, or replace with Lucide/heroicons/your favorite) */}
                        <path d="M22.3092 18.3098C22.0157 18.198 ..." stroke="#32B6C8" strokeWidth={2} />
                      </svg>
                      <span className="text-black text-base ml-5">55 5123 4567</span>
                    </a>
                    <a href="mailto:contacto@cuattrovistas.com" className="flex items-center mb-6 group">
                      <svg width={30} height={30} viewBox="0 0 30 30" fill="none" className="shrink-0">
                        <path d="M2.81501 8.75L10.1985 ..." stroke="#32B6C8" strokeWidth={2} />
                      </svg>
                      <span className="text-black text-base ml-5">contacto@cuattrovistas.com</span>
                    </a>
                    <a href="https://maps.google.com?q=Tu+Direccion+en+CDMX" target="_blank" className="flex items-center group">
                      <svg width={30} height={30} viewBox="0 0 30 30" fill="none" className="shrink-0">
                        <path d="M25 12.9169C25 ..." stroke="#32B6C8" strokeWidth={2} />
                      </svg>
                      <span className="text-black text-base ml-5">CDMX, México</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* RIGHT: Contact form */}
          <div className="bg-gray-50 p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl">
            <h2 className="text-primary font-manrope text-4xl font-semibold leading-10 mb-11">Envíanos un Mensaje</h2>
            <form className="space-y-6">
              <input
                type="text"
                name="name"
                className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-3"
                placeholder="Nombre"
                required
              />
              <input
                type="email"
                name="email"
                className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-3"
                placeholder="Correo Electrónico"
                required
              />
              <input
                type="tel"
                name="phone"
                className="w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-3"
                placeholder="Teléfono"
              />

              <div className="mb-4">
                <h4 className="text-gray-500 text-lg font-normal leading-7 mb-4">
                  ¿Cómo prefieres que te contactemos?
                </h4>
                <div className="flex">
                  <label className="flex items-center mr-11 cursor-pointer">
                    <input
                      type="radio"
                      name="contact_method"
                      value="email"
                      className="hidden peer"
                      required
                    />
                    <span className="border border-gray-300 rounded-full mr-2 w-4 h-4 peer-checked:bg-primary peer-checked:border-primary transition"></span>
                    <span className="text-gray-500 text-base">Email</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="contact_method"
                      value="phone"
                      className="hidden peer"
                    />
                    <span className="border border-gray-300 rounded-full mr-2 w-4 h-4 peer-checked:bg-primary peer-checked:border-primary transition"></span>
                    <span className="text-gray-500 text-base">Teléfono</span>
                  </label>
                </div>
              </div>

              <textarea
                name="message"
                className="w-full h-24 text-gray-600 placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-xl border border-gray-200 focus:outline-none pl-4 pt-3 mb-4 resize-none"
                placeholder="Mensaje"
                required
              />

              <button
                type="submit"
                className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-300 hover:bg-secondary bg-primary shadow-sm"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
