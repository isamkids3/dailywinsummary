import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface WrappedLayoutProps {
    children: ReactNode;
    onNext: () => void;
    onPrev: () => void;
    currentSlideIndex: number;
    totalSlides: number;
    slideDurationMs: number;
}

export function WrappedLayout({
    children,
    onNext,
    onPrev,
    currentSlideIndex,
    totalSlides,
    slideDurationMs
}: WrappedLayoutProps) {
    const progressRefs = useRef<(HTMLDivElement | null)[]>([]);
    const animationRef = useRef<number>(null);

    useEffect(() => {
        let startTime = Date.now();

        const updateProgress = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progressPercent = Math.min(elapsed / slideDurationMs, 1);

            // Update DOM directly to bypass React render cycle
            progressRefs.current.forEach((el, index) => {
                if (!el) return;
                let scale = 0;
                if (index < currentSlideIndex) scale = 1;
                else if (index === currentSlideIndex) scale = progressPercent;

                el.style.transform = `scaleX(${scale})`;
            });

            if (progressPercent < 1) {
                animationRef.current = requestAnimationFrame(updateProgress);
            } else {
                onNext();
            }
        };

        animationRef.current = requestAnimationFrame(updateProgress);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [currentSlideIndex, slideDurationMs, onNext]);

    return (
        <div className="fixed inset-0 bg-neutral-900 text-white overflow-hidden flex flex-col select-none">
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-2 pt-4">
                {Array.from({ length: totalSlides }).map((_, i) => (
                    <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            ref={(el) => { progressRefs.current[i] = el; }}
                            className="h-full bg-white will-change-transform"
                            style={{
                                transformOrigin: 'left',
                                transform: 'scaleX(0)',
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-40 pointer-events-none">{children}</div>

            {/* Touch Interaction Areas */}
            <div className="absolute inset-0 z-30 flex">
                <div className="flex-1 opacity-0 cursor-pointer" onClick={onPrev} />
                <div className="flex-1 opacity-0 cursor-pointer" onClick={onNext} />
            </div>
        </div>
    );
}
