"use client";

import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@heroui/react";
import UserProfilePanel from "./userProfilePanel";

// Define a type for the user profile that UserProfilePanel expects.
// This is based on the error message, and likely corresponds to your Prisma User model.
type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  avatarUrl: string | null;
  createdAt: Date;
};

type SignInPanelClientProps = {
  user: unknown;
  // Use the new UserProfile type for dbUser to satisfy the UserProfilePanel component.
  dbUser: UserProfile | null;
  isAuthenticated: boolean;
};

export default function SignInPanelClient({ user, dbUser, isAuthenticated }: SignInPanelClientProps) {
  if (isAuthenticated) {
    // Check if dbUser exists before rendering the component.
    // This is the correct way to handle optional props.
    return <>{dbUser && <UserProfilePanel user={dbUser} />}</>;
  }

  return (
    <div className="flex gap-3">
      <Button color="primary">
        <LoginLink>Iniciar Sesión / Registrarse</LoginLink>
      </Button>
    </div>
  );
}
