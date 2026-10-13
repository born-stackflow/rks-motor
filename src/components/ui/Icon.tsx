// SVG icon components — zero dependency, matches lucide-react API shape
type IconProps = { className?: string; strokeWidth?: number }

const icon = (path: string | string[], viewBox = '0 0 24 24') =>
  function Icon({ className = 'h-5 w-5', strokeWidth = 2 }: IconProps) {
    return (
      <svg
        className={className}
        fill="none"
        viewBox={viewBox}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {Array.isArray(path)
          ? path.map((d, i) => <path key={i} d={d} />)
          : <path d={path} />}
      </svg>
    )
  }

export const ChevronDown = icon('M19 9l-7 7-7-7')
export const ChevronRight = icon('M9 18l6-6-6-6')
export const ChevronLeft = icon('M15 18l-6-6 6-6')
export const Check = icon('M5 13l4 4L19 7')
export const Menu = icon('M4 6h16M4 12h16M4 18h16')
export const X = icon('M6 18L18 6M6 6l12 12')
export const Search = icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')
export const Phone = icon('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z')
export const Mail = icon('M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')
export const MapPin = icon(['M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z'])
export const ArrowRight = icon('M5 12h14M12 5l7 7-7 7')
export const ArrowLeft = icon('M19 12H5M12 19l-7-7 7-7')
export const Filter = icon('M22 3H2l8 9.46V19l4 2v-8.54L22 3z')
export const SlidersHorizontal = icon(['M4 21v-7', 'M4 10V3', 'M12 21V12', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6'])
export const Grid = icon(['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'])
export const List = icon(['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'])
export const Star = icon('M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z')
export const Heart = icon('M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z')
export const Share2 = icon(['M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'])
export const Download = icon(['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'])
export const ExternalLink = icon(['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3'])
export const Building2 = icon(['M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18z', 'M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2', 'M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2', 'M10 6h4', 'M10 10h4', 'M10 14h4', 'M10 18h4'])
export const Users = icon(['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 11a4 4 0 100-8 4 4 0 000 8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'])
export const Award = icon(['M12 15a6 6 0 100-12 6 6 0 000 12z', 'M8.21 13.89L7 23l5-3 5 3-1.21-9.12'])
export const Zap = icon('M13 2L3 14h9l-1 8 10-12h-9l1-8z')
export const Globe = icon(['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M2 12h20', 'M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z'])
export const Wrench = icon('M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z')
export const Clock = icon(['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 6v6l4 2'])
export const Calendar = icon(['M8 2v4', 'M16 2v4', 'M3 10h18', 'M3 6a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6z'])
export const Tag = icon(['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'])
export const Package = icon(['M16.5 9.4l-9-5.19', 'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z', 'M3.27 6.96L12 12.01l8.73-5.05', 'M12 22.08V12'])
export const Gauge = icon(['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 12l4-4'])
export const Fuel = icon(['M3 22V8a2 2 0 012-2h7', 'M12 22V6', 'M16 2l4 4-4 4', 'M20 6H12', 'M3 12h4', 'M3 17h4'])
export const Weight = icon(['M12 5a3 3 0 100-6 3 3 0 000 6z', 'M6.5 8a2 2 0 00-1.905 1.46L2.1 18.5A2 2 0 004 21h16a2 2 0 001.9-2.54L19.4 9.46A2 2 0 0017.48 8z'])
export const Ruler = icon(['M2 12h20', 'M12 2v20'])
export const ChevronUp = icon('M18 15l-6-6-6 6')
export const Plus = icon(['M12 5v14', 'M5 12h14'])
export const Minus = icon('M5 12h14')
export const Info = icon(['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 8v4', 'M12 16h.01'])
export const AlertCircle = icon(['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 8v4', 'M12 16h.01'])
export const CheckCircle = icon(['M22 11.08V12a10 10 0 11-5.93-9.14', 'M22 4L12 14.01l-3-3'])
export const Eye = icon(['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 12a3 3 0 100-6 3 3 0 000 6z'])
export const Send = icon('M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z')
export const Loader2 = icon('M21 12a9 9 0 11-6.219-8.56')
export const Truck = icon(['M1 3h15v13H1z', 'M16 8h4l3 3v5h-7V8z', 'M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'])
export const Headphones = icon(['M3 18v-6a9 9 0 0118 0v6', 'M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z'])
export const BadgePercent = icon(['M3.85 8.62a4 4 0 014.78-4.77 4 4 0 016.74 0 4 4 0 014.78 4.78 4 4 0 010 6.74 4 4 0 01-4.77 4.78 4 4 0 01-6.75 0 4 4 0 01-4.78-4.77 4 4 0 010-6.76z', 'M15 9l-6 6', 'M9 9h.01', 'M15 15h.01'])
export const ShoppingCart = icon(['M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 01-8 0'])
