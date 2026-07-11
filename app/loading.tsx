export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Spinning ring with RKS logo */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-2 border-dark-3 rounded-full" />
          <div className="absolute inset-0 border-2 border-t-red border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-red font-bold text-xl" style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>
              RKS
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-off-white text-sm font-semibold uppercase tracking-[0.2em] mb-1">Loading</p>
          <p className="text-mid text-xs uppercase tracking-widest">Premium Italian Motorcycles</p>
        </div>
        {/* Progress bar */}
        <div className="w-40 h-[2px] bg-dark-3 overflow-hidden">
          <div className="h-full bg-red w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
