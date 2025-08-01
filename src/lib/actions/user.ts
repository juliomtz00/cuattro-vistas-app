"use server";
import prisma from "@/lib/prisma";

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
}
    );
    }