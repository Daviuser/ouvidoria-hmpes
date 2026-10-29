import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ouvidoria — Hospital Municipal de Santaluz",
  description: "Registre sua manifestação ou avalie os setores do Hospital Municipal de Santaluz.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
