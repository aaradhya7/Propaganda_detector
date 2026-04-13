export default function Topbar(){
  return(
    <header className="h-16 border-b border-outline-variant/10 flex items-center justify-between px-8">
      <h2 className="text-lg font-medium">Dashboard</h2>

      <div className="text-xs px-3 py-1 bg-surface-container rounded-full">
        Engine: <span className="text-primary">Obsidian-L4</span>
      </div>
    </header>
  )
}
