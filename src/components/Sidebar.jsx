import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-surface-container-low border-r border-outline-variant/10 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary">psychology</span>
          </div>
          <h1 className="text-lg font-bold text-on-surface">
            Propaganda Detector
          </h1>
        </div>

        <p className="text-sm text-on-surface-variant">
          Analysis Dashboard
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <NavLink 
          to="/" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-surface-container text-primary' : 'hover:bg-surface-container text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-sm">Home</span>
        </NavLink>

        <NavLink 
          to="/history" 
          className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-surface-container text-primary' : 'hover:bg-surface-container text-on-surface-variant'}`}
        >
          <span className="material-symbols-outlined">history</span>
          <span className="text-sm">History</span>
        </NavLink>
      </nav>
    </aside>
  );
}
