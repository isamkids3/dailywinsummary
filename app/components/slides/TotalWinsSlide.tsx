interface TotalWinsSlideProps {
    totalWins: number;
}

export function TotalWinsSlide({ totalWins }: TotalWinsSlideProps) {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-700 via-blue-600 to-cyan-500">
            <div className="w-full max-w-sm flex flex-col items-center animate-slide-up">
                <h2 className="text-3xl font-extrabold text-white mb-2 text-center drop-shadow-md">
                    You crushed it.
                </h2>
                <p className="text-white/80 text-lg font-medium text-center">Across physical, mental, and spiritual wins...</p>

                <div className="my-12 relative w-full aspect-square flex items-center justify-center">
                    {/* Decorative rings */}
                    <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-[spin_10s_linear_infinite] will-change-transform" />
                    <div className="absolute inset-4 border-4 border-white/30 rounded-full animate-[spin_8s_linear_infinite_reverse] will-change-transform" />

                    <div className="relative z-10 flex flex-col items-center justify-center bg-white text-blue-600 rounded-full w-48 h-48 shadow-[0_0_40px_rgba(255,255,255,0.3)] opacity-0 animate-pop-in [animation-delay:400ms]">
                        <span className="text-6xl font-black">{totalWins}</span>
                        <span className="text-sm font-bold uppercase tracking-widest mt-1 opacity-80 text-center leading-tight">Total<br />Wins</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
