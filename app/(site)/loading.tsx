export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-dark-3 rounded-full" />
        <div className="absolute inset-0 border-2 border-t-red border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center font-display text-red text-lg tracking-[0.05em]">
          RKS
        </span>
      </div>
    </div>
  )
}
