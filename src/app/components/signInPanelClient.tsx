"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@heroui/react";
import UserProfilePanel from "./userProfilePanel";

type SignInPanelClientProps = {
  user: unknown; // TODO: Replace 'unknown' with a specific user type
  dbUser: unknown;
  isAuthenticated: boolean;
};

export default function SignInPanelClient({ user, dbUser, isAuthenticated }: SignInPanelClientProps) {
  if (isAuthenticated) {
    return <>{dbUser!! && <UserProfilePanel user={dbUser}/>}</>
  }

  return (
    <div className="flex gap-3">
      <Button color="primary">
        <LoginLink>Iniciar Sesión / Registrarse</LoginLink>
      </Button>
    </div>
  );
}
