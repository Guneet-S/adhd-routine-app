import Link from 'next/link';

export default function MorePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
      <p className="text-slate-400 text-sm">More options coming soon.</p>
      <Link href="/dashboard" className="mt-4 text-primary font-semibold text-sm">
        Back to Dashboard
      </Link>
    </div>
  );
}
