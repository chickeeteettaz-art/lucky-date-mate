"use client";

type WheelOption = {
    label: string;
    kind: "profile" | "bonus" | "game-over";
    image?: string;
    detail?: string;
};

type RouletteWheelProps = {
    options: WheelOption[];
    isSpinning: boolean;
    onSpin: () => void;
};

export default function RouletteWheel({ options, isSpinning, onSpin }: RouletteWheelProps) {
    return (
        <div className="wheel-stage">
            <div className="wheel-pointer" aria-hidden="true" />
            <div className={`roulette-wheel ${isSpinning ? "roulette-wheel--spinning" : ""}`}>
                {options.map((option, index) => (
                    <div
                        className={`wheel-slice wheel-slice--${option.kind}`}
                        key={`${option.label}-${index}`}
                        style={{
                            transform: `rotate(${index * 60}deg) skewY(-30deg)`,
                            backgroundImage: option.image ? `url(${option.image})` : undefined,
                        }}
                    >
                        <span className="wheel-slice-copy">
                            {option.image && <strong>{option.label}</strong>}
                            <small>{option.detail ?? option.label}</small>
                        </span>
                    </div>
                ))}
                <button className="wheel-hub" type="button" onClick={onSpin} disabled={isSpinning} aria-label="Spin the date wheel">
                    <span>{isSpinning ? "..." : "SPIN"}</span>
                </button>
            </div>
        </div>
    );
}
