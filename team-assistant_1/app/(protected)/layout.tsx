import { redirect } from "next/navigation";
import AuthHeader from "@/components/auth/AuthHeader";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <>
      <AuthHeader name={user.name} username={user.username} />
      {children}
    </>
  );
}
