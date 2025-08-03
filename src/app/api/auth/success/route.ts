import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) {
        throw new Error("Something went wrong with authentication: " + JSON.stringify(user));
    }

    const dbUser = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });

    if (!dbUser) {
        await prisma.user.create({
            data: {
                id: user.id,
                firstName: user.given_name || "",  // ✅ map from Kinde
                lastName: user.family_name || "", // ✅ map from Kinde
                username: (user.email ? user.email.split("@")[0] : `user_${user.id}`),
                email: user.email ?? "",
                password: "", // ✅ placeholder if password is required
            },
        });
    }

    return NextResponse.redirect("https://cuattro-vistas-app.vercel.app/");
}
