import Link from "next/link";

export default function BrandMark({ compact = false }: { compact?: boolean }) {
  return <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Effortly 홈"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base font-bold text-white shadow-lg shadow-indigo-500/20">E</span>{!compact && <span className="text-lg font-bold tracking-tight text-slate-900">Effortly</span>}</Link>;
}
