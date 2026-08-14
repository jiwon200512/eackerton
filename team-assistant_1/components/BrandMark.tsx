import Image from "next/image";
import Link from "next/link";

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Effortly 홈"><Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" priority />{!compact && <span className="text-lg font-bold tracking-tight text-slate-900">Effortly</span>}</Link>;
}
