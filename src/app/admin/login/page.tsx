import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Acesso administrativo — Ouvidoria" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin/dashboard");
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} className="mx-auto mb-6 h-14 w-auto" />
      <h1 className="mb-4 text-center text-xl font-bold">Acesso administrativo da Ouvidoria</h1>
      <LoginForm />
    </main>
  );
}
