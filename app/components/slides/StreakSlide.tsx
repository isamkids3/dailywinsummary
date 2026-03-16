interface StreakSlideProps {
    streakCount: number;
}

export function StreakSlide({ streakCount }: StreakSlideProps) {
    return (
        <div className="h-full w-full flex flex-col p-8 bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400">
            <div className="flex-1 flex flex-col justify-center animate-slide-up">
                <h2 className="text-2xl font-bold text-white/90 mb-6 tracking-wider uppercase">
                    Your Longest Streak
                </h2>
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl relative overflow-hidden flex flex-col items-center">
                    {/* Decorative element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-50 animate-pulse" />

                    <div className="relative z-10 text-center">
                        <p className="text-8xl font-black text-white opacity-0 animate-pop-in [animation-delay:300ms] drop-shadow-xl">{streakCount}</p>
                        <p className="text-xl font-bold text-white/90 mt-4 uppercase tracking-widest opacity-0 animate-slide-up [animation-delay:600ms]">Days In A Row</p>
                    </div>
                </div>
                <p className="mt-8 text-center text-white/80 font-medium text-lg leading-relaxed opacity-0 animate-fade-in [animation-delay:1000ms]">
                    That's genuine dedication. Look at what you're capable of when you commit.
                </p>
            </div>
        </div>
    );
}
