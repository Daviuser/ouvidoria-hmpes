import Image from "next/image";

export function PublicHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Image src="/images/logo-hospital.jpeg" alt="Hospital Municipal de Santaluz" width={1600} height={535} priority className="h-14 w-auto sm:h-16" />
      </div>
      <div className="h-1 bg-brand-600" />
    </header>
  );
}
