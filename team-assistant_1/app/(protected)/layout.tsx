import { redirect } from "next/navigation";
import ProtectedShell from "@/components/layout/ProtectedShell";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ProtectedShell user={{ name: user.name, username: user.username }}>{children}</ProtectedShell>;
}
