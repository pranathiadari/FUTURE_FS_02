import { FiMenu, FiBell, FiSearch } from 'react-icons/fi';
import { User } from '../data/types';

interface NavbarProps {
  title: string;
  user: User | null;
  onMenuToggle: () => void;
}

export function Navbar({ title, user, onMenuToggle }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-dark-700 transition-all"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white font-semibold text-lg leading-none">{title}</h1>
            <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-dark-700/60 border border-slate-600/30 rounded-xl px-3 py-2 w-52">
            <FiSearch className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none w-full"
            />
          </div>

          {/* Notifications */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-dark-700/60 transition-all">
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-dark-900" />
          </button>

          {/* Avatar */}
          <div className="flex items-center gap-2.5 ml-1 cursor-pointer group">
            <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white text-sm font-bold">{user?.name?.[0] ?? 'A'}</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-white text-sm font-medium leading-none">{user?.name ?? 'Admin'}</div>
              <div className="text-slate-500 text-xs mt-0.5">{user?.role ?? 'Administrator'}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
