import { Link } from "react-router";

export function OutroSlide() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-700 via-indigo-800 to-gray-900">
            <div className="w-full max-w-sm flex flex-col items-center animate-slide-up">
                <h2 className="text-4xl sm:text-5xl font-black text-white mb-2 text-center drop-shadow-lg tracking-tight leading-tight">
                    Keep showing up.
                </h2>

                <div className="my-16 relative w-full flex items-center justify-center h-32">
                    <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 animate-fade-in [animation-delay:600ms]" />
                </div>

                <div className="flex flex-col items-center">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="pointer-events-auto absolute bottom-12 px-10 py-5 bg-white text-indigo-900 rounded-full font-black text-xl hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)] opacity-0 animate-fade-in [animation-delay:1000ms] cursor-pointer"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
