interface DeepSeekSlideProps {
    summaryText: string;
    isLoading: boolean;
}

export function DeepSeekSlide({ summaryText, isLoading }: DeepSeekSlideProps) {
    return (
        <div className="h-full w-full flex flex-col p-8 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800">
            <div className="flex-1 flex flex-col justify-center animate-slide-up">
                <p className="text-indigo-300 uppercase tracking-widest text-sm font-bold mb-6 text-center">
                    A letter to you
                </p>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
                        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-6" />
                        <p className="text-indigo-200 font-medium animate-pulse text-center">Reflecting on your journey...</p>
                    </div>
                ) : (
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl relative overflow-hidden">
                        {/* Decorative Quote Mark */}
                        <div className="absolute top-4 left-4 text-white/10 text-8xl font-serif leading-none select-none">"</div>

                        <div className="relative z-10 text-white leading-relaxed text-base sm:text-lg font-medium opacity-0 animate-fade-in [animation-delay:400ms] space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar pb-4 pr-2">
                            {summaryText.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
