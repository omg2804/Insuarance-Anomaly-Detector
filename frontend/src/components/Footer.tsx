import { Trophy } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 mt-12">
      <div className="max-w-full px-8 py-6">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="size-4 text-amber-500" />
          <p className="text-center text-sm text-slate-600">
            Built for <span className="text-blue-600">Abacus Insights Hackathon</span> — 2025
          </p>
        </div>
      </div>
    </footer>
  );
}