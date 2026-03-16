import { useEffect, useState } from "react";
import type { Route } from "./+types/wrapped";
import { WrappedLayout } from "../components/WrappedLayout";
import { IntroSlide } from "../components/slides/IntroSlide";
import { TotalWinsSlide } from "../components/slides/TotalWinsSlide";
import { BreakdownSlide } from "../components/slides/BreakdownSlide";
import { StreakSlide } from "../components/slides/StreakSlide";
import { DeepSeekSlide } from "../components/slides/DeepSeekSlide";
import { OutroSlide } from "../components/slides/OutroSlide";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Your Daily Win Summary" },
        { name: "description", content: "A look back at your daily wins." },
    ];
}

const SLIDE_DURATION_MS = 6000;
const DEEPSEEK_SLIDE_DURATION_MS = 15000;
const TOTAL_SLIDES = 6;

// Type definitions for our backend response
interface WrappedData {
    stats: {
        totalWins: number;
        physicalCount: number;
        mentalCount: number;
        spiritualCount: number;
        longestStreak: number;
        totalEntries: number;
    };
    summary: string;
}

export default function Wrapped() {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [appData, setAppData] = useState<WrappedData | null>(null);

    const handleStartExperience = async (username: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = import.meta.env.VITE_APPS_SCRIPT_URL;
            if (!endpoint) {
                throw new Error("Missing VITE_APPS_SCRIPT_URL in .env configuration.");
            }

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ username })
            });

            if (!res.ok && res.type !== 'opaque') {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server responded with status: ${res.status}`);
            }

            const result = await res.json() as WrappedData & { error?: string };
            if (result.error) {
                throw new Error(result.error);
            }

            setAppData(result);

            // Only advance the slides when the data arrives successfully
            setCurrentSlideIndex(1);

        } catch (err: unknown) {
            console.error("Failed to fetch wrapped data:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
            // If it critically fails before hitting the layout, drop them back to start
            setCurrentSlideIndex(0);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (currentSlideIndex < TOTAL_SLIDES - 1) {
            setCurrentSlideIndex((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex((prev) => prev - 1);
        }
    };

    // Render the current slide based on index
    const renderSlide = () => {
        switch (currentSlideIndex) {
            case 0:
                // We show loading state on the button itself if it errors out and kicks them back
                // Or if they somehow stay on the screen while it's fetching
                return <IntroSlide onStart={handleStartExperience} isLoading={isLoading && currentSlideIndex === 0} />;
            case 1:
                return <TotalWinsSlide totalWins={appData?.stats?.totalWins || 0} />;
            case 2:
                return (
                    <BreakdownSlide
                        physical={appData?.stats?.physicalCount || 0}
                        mental={appData?.stats?.mentalCount || 0}
                        spiritual={appData?.stats?.spiritualCount || 0}
                    />
                );
            case 3:
                return <StreakSlide streakCount={appData?.stats?.longestStreak || 0} />;
            case 4:
                return <DeepSeekSlide summaryText={appData?.summary || ""} isLoading={isLoading} />;
            case 5:
                return <OutroSlide />;
            default:
                return null;
        }
    };

    // If an error occurred and we were booted back to the intro slide, 
    // display it as an overlay/alert
    return (
        <div className="relative w-full h-full">
            {error && currentSlideIndex === 0 && (
                <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white p-4 rounded-xl z-[100] font-medium shadow-xl backdrop-blur-md">
                    <p className="font-bold mb-1">Error Generating Summary</p>
                    <p className="text-sm">{error}</p>
                    <button
                        onClick={() => setError(null)}
                        className="mt-2 text-xs uppercase font-bold tracking-wider opacity-80 hover:opacity-100"
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {currentSlideIndex === 0 ? (
                // We don't want the WrappedLayout progress bars and hidden click interceptors on the very first slide 
                // Because they interfere with the input field
                <div className="w-full h-screen fixed inset-0">
                    {renderSlide()}
                </div>
            ) : (
                <WrappedLayout
                    currentSlideIndex={currentSlideIndex}
                    totalSlides={TOTAL_SLIDES}
                    slideDurationMs={currentSlideIndex === 4 ? DEEPSEEK_SLIDE_DURATION_MS : SLIDE_DURATION_MS}
                    onNext={handleNext}
                    onPrev={handlePrev}
                >
                    <div key={currentSlideIndex} className="w-full h-full">
                        {renderSlide()}
                    </div>
                </WrappedLayout>
            )}
        </div>
    );
}
