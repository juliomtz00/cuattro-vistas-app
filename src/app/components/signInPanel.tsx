import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import SignInPanelClient from "./signInPanelClient";
import prisma from "@/lib/prisma";

export default async function SignInPanel() {
  const { isAuthenticated, getUser } = getKindeServerSession();
  const authenticated = (await isAuthenticated()) ?? false;

  let user = null;
  let dbUser = null;

  if (authenticated) {
    user = await getUser();
    if (user?.id) {
      dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
    }
  }

  return (
    <SignInPanelClient user={user} dbUser={dbUser} isAuthenticated={authenticated} />
  );
}
