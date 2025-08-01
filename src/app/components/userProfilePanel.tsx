import { User as PrismaUser } from "@/generated/prisma";
import React from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User} from "@heroui/react";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { useRouter } from "next/navigation";


interface UserProfilePanelProps {

    user: PrismaUser;

}

const UserProfilePanel = ({ user }: UserProfilePanelProps) => {
    const router = useRouter();

    const handleAction = (key: string) => {
        if (key === "profile") router.push("/user/profile");
        if (key === "properties") router.push("/user/properties");
    };

    return (
        <Dropdown placement="bottom-start">
            <DropdownTrigger>
            <User
                as="button"
                className="transition-transform hover:scale-105 cursor-pointer"
                name={`${user.firstName} ${user.lastName}`}
                description="Ver Opciones"
            />
            </DropdownTrigger>
            <DropdownMenu
                aria-label="User Actions"
                variant="flat"
                onAction={(key) => handleAction(key as string)}
            >
                <DropdownItem key="profile">Perfil</DropdownItem>
                <DropdownItem key="properties">Propiedades</DropdownItem>
                <DropdownItem key="logout" color="danger">
                    <LogoutLink>Cerrar Sesión</LogoutLink>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

export default UserProfilePanel;
