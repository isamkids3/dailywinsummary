interface IntroSlideProps {
    onStart: (username: string) => void;
    isLoading: boolean;
}

export function IntroSlide({ onStart, isLoading }: IntroSlideProps) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get("username") as string;
        if (username.trim()) {
            onStart(username.trim());
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative z-50 pointer-events-auto">
            <h1 className="text-5xl font-extrabold text-center tracking-tight animate-fade-in text-white drop-shadow-lg">
                Ready for your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 block mt-4 text-7xl">
                    Summary?
                </span>
            </h1>

            <form onSubmit={handleSubmit} className="mt-12 flex flex-col items-center w-full max-w-xs animate-slide-up [animation-delay:400ms]">
                <input
                    type="text"
                    name="username"
                    placeholder="Enter your Username"
                    required
                    className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 text-center font-medium focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
                />

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full px-8 py-4 bg-white text-indigo-700 rounded-full font-bold text-lg hover:scale-105 transition-transform active:scale-95 shadow-xl disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        "Generate My Wrapped"
                    )}
                </button>
            </form>
        </div>
    );
}
