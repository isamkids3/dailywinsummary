interface BreakdownSlideProps {
    physical: number;
    mental: number;
    spiritual: number;
}

export function BreakdownSlide({ physical, mental, spiritual }: BreakdownSlideProps) {
    const total = Math.max(physical + mental + spiritual, 1);

    return (
        <div className="h-full w-full flex flex-col justify-center p-8 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-500">
            <div className="w-full max-w-md mx-auto animate-slide-up">
                <h2 className="text-4xl font-black text-white mb-2 drop-shadow-md leading-tight">
                    How you showed up.
                </h2>
                <p className="text-white/80 text-lg mb-10 font-medium">Your win distribution.</p>

                <div className="space-y-6">
                    {/* Physical */}
                    <div className="w-full opacity-0 animate-slide-up [animation-delay:300ms]">
                        <div className="flex justify-between text-white font-bold mb-2">
                            <span>Physical</span>
                            <span>{physical}</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out delay-700"
                                style={{ width: `${(physical / total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Mental */}
                    <div className="w-full opacity-0 animate-slide-up [animation-delay:500ms]">
                        <div className="flex justify-between text-white font-bold mb-2">
                            <span>Mental</span>
                            <span>{mental}</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-pink-400 rounded-full transition-all duration-1000 ease-out delay-900"
                                style={{ width: `${(mental / total) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Spiritual */}
                    <div className="w-full opacity-0 animate-slide-up [animation-delay:700ms]">
                        <div className="flex justify-between text-white font-bold mb-2">
                            <span>Spiritual</span>
                            <span>{spiritual}</span>
                        </div>
                        <div className="h-4 bg-white/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-indigo-300 rounded-full transition-all duration-1000 ease-out delay-1000"
                                style={{ width: `${(spiritual / total) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
