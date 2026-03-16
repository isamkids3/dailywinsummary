import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Go Youth" },
    { name: "description", content: "Go Youth Daily Win Summary" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden font-sans">
      {/* Decorative ambient light similar to wrapped gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse will-change-opacity" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse [animation-delay:2s] will-change-opacity" />

      <div className="relative z-10 flex flex-col items-center animate-slide-up w-full max-w-md">
        {/* Logo SVG */}
        <svg viewBox="0 -40 350 390" className="w-full h-auto drop-shadow-2xl mb-12 max-w-[350px]">
          {/* Curved text path */}
          <path id="curve" d="M 50,130 A 110,110 0 0,1 300,130" fill="transparent" />
          <text className="fill-[#f5f1e3] font-black tracking-widest text-[2.7rem] select-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            <textPath href="#curve" startOffset="50%" textAnchor="middle">
              GO YOUTH
            </textPath>
          </text>

          {/* Globe */}
          <g className="stroke-[#f5f1e3] fill-transparent transition-all duration-700 hover:stroke-pink-400 cursor-crosshair" strokeWidth="2">
            {/* Outer circle */}
            <circle cx="175" cy="190" r="95" />

            {/* Longitudes */}
            <ellipse cx="175" cy="190" rx="35" ry="95" />
            <ellipse cx="175" cy="190" rx="70" ry="95" />

            {/* Latitudes */}
            <ellipse cx="175" cy="190" rx="95" ry="35" />
            <ellipse cx="175" cy="190" rx="95" ry="70" />

            {/* Diagonals */}
            <ellipse cx="175" cy="190" rx="45" ry="95" transform="rotate(45 175 190)" />
            <ellipse cx="175" cy="190" rx="45" ry="95" transform="rotate(-45 175 190)" />
            <ellipse cx="175" cy="190" rx="20" ry="95" transform="rotate(25 175 190)" />
            <ellipse cx="175" cy="190" rx="20" ry="95" transform="rotate(-25 175 190)" />
          </g>

          {/* est 2023 */}
          <text x="175" y="325" className="fill-[#f5f1e3] text-[1.1rem] font-medium tracking-[0.2em] select-none" textAnchor="middle" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            est 2023
          </text>
        </svg>

        {/* Enter Experience Button - matches the wrapped vibrant gradient */}
        <Link
          to="/wrapped"
          className="group relative w-full sm:w-auto px-8 py-4 bg-[#1c1c1c] rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(236,72,153,0.15)] animate-pop-in [animation-delay:400ms] text-center flex items-center justify-center"
        >
          {/* Vibrant gradient background from wrapped, revealed on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />

          {/* Border highlight for normal state */}
          <div className="absolute inset-[2px] bg-[#232323] rounded-full z-0 group-hover:bg-opacity-0 transition-all duration-300" />

          <span className="relative z-10 tracking-widest flex items-center justify-center gap-3 text-[#f5f1e3] group-hover:text-white transition-colors duration-300">
            VIEW SUMMARY
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1.5 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}
