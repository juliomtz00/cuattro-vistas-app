"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Image,
} from "@heroui/react";
import { usePathname } from "next/navigation";

interface AppbarProps {
  children: React.ReactNode;
}

const menuItems = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/us" },
  { label: "Propiedades", href: "/property" },
  { label: "Contacto", href: "/contact" },
];

const Appbar = ({ children }: AppbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <Navbar className="shadow-md" onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center text-primary-400 hover:text-primary-600 transition-colors">
            <Image src="/logo-cuattrovistas.png" alt="Logo" width={150} height={40} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Desktop Menu */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <NavbarItem key={item.label} isActive={isActive}>
              <Link
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                className={
                  isActive
                    ? "font-bold underline underline-offset-4 text-secondary"
                    : ""
                }
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      {/* Area for user actions like Login/Logout/Avatar */}
      <NavbarContent justify="end">{children}</NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <NavbarMenuItem key={item.label}>
              <Link
                className={
                  "w-full " +
                  (isActive
                    ? "font-bold underline underline-offset-4 text-blue-700"
                    : "")
                }
                color={isActive ? "primary" : "foreground"}
                href={item.href}
                size="lg"
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            </NavbarMenuItem>
          );
        })}
      </NavbarMenu>
    </Navbar>
  );
};

export default Appbar;
