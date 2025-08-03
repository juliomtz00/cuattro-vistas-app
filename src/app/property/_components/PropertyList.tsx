// app/properties/_components/PropertyList.tsx
import Link from "next/link";
import Image from "next/image";

type Property = {
  id: number;
  title: string;
  price: number;
  type: { value: string };
  location?: { city?: { name: string; state?: { name: string } } } | null;
  images: { url: string }[];
};

export default function PropertyList({ properties }: { properties: Property[] }) {
  if (!properties || properties.length === 0) {
    return <div className="text-center py-24 text-gray-400">No hay propiedades disponibles.</div>;
  }
  return (
    <section className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
        {properties.map((prop) => (
          <Link
            href={`/property/${prop.id}`}
            key={prop.id}
            className="group bg-white rounded-2xl shadow hover:shadow-xl transition border border-blue-50 flex flex-col"
          >
            <div>
              <Image
                src={prop.images?.[0]?.url || "/default-property.jpg"}
                alt={prop.title}
                width={400}
                height={300}
                className="w-full aspect-square rounded-t-2xl object-cover group-hover:scale-105 transition"
                priority
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <h6 className="font-semibold text-lg text-gray-900 truncate group-hover:text-primary">{prop.title}</h6>
                <span className="font-bold text-primary text-base">
                  {prop.price?.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
                </span>
              </div>
              <div className="text-gray-500 text-sm mb-1 truncate">
                {prop.location?.city?.name || "Ciudad"}, {prop.location?.city?.state?.name || "Estado"}
              </div>
              <span className="inline-block bg-blue-100 text-primary rounded px-3 py-0.5 text-xs font-semibold w-max">
                {prop.type?.value}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
