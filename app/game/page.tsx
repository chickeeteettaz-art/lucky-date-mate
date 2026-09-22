"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RouletteWheel from "@/components/RouletteWheel";
import users from "@/data/index.js";
import type { User } from "@/types/user";

const profiles = users as User[];

function getCandidateIds() {
    const ids = new Set<number>();
    while (ids.size < 3) ids.add(Math.floor(Math.random() * profiles.length));
    return [...ids];
}

export default function GamePage() {
    const router = useRouter();
    const [spins, setSpins] = useState(3);
    const [candidateIds, setCandidateIds] = useState(getCandidateIds);
    const [isSpinning, setIsSpinning] = useState(false);
    const [status, setStatus] = useState("Three chances. One conversation worth finding.");

    const wheelOptions = [
        ...candidateIds.map((id) => ({ label: profiles[id].name, kind: "profile" as const, image: profiles[id].image })),
        { label: "+2 spins", kind: "bonus" as const },
        { label: "+5 spins", kind: "bonus" as const },
        { label: "Game over", kind: "game-over" as const },
    ];

    function resetRound(message: string) {
        setCandidateIds(getCandidateIds());
        setSpins(3);
        setStatus(message);
    }

    function spin() {
        if (isSpinning || spins < 1) return;
        setIsSpinning(true);
        setStatus("The wheel is choosing your next conversation...");

        window.setTimeout(() => {
            const result = Math.floor(Math.random() * 6);
            setIsSpinning(false);

            if (result < 3) {
                router.push(`/profile/${profiles[candidateIds[result]].id}`);
                return;
            }

            if (result === 3 || result === 4) {
                const bonus = result === 3 ? 2 : 5;
                setSpins((current) => current - 1 + bonus);
                setStatus(`Lucky break: you gained ${bonus} more spins.`);
                return;
            }

            resetRound("Game over. A fresh set of dates is ready.");
        }, 950);
    }

    return (
        <main className="game-shell">
            <header className="topbar">
                <Link className="brand" href="/">lucky<span>date</span></Link>
                <div className="spin-counter"><strong>{spins}</strong><span> spins left</span></div>
            </header>
            <section className="game-intro">
                <p className="eyebrow">The conversation roulette</p>
                <h1>Let chance<br /><em>start something.</em></h1>
                <p className="game-copy">Every spin opens a door. Land on a profile and see where the conversation goes.</p>
            </section>
            <section className="wheel-panel" aria-label="Speed dating roulette">
                <RouletteWheel options={wheelOptions} isSpinning={isSpinning} onSpin={spin} />
                <p className="wheel-status" aria-live="polite">{status}</p>
                <div className="wheel-legend"><span><i className="dot dot--date" />Meet someone</span><span><i className="dot dot--bonus" />More spins</span><span><i className="dot dot--end" />Game over</span></div>
            </section>
            <footer className="game-footer"><span>01 / 30 profiles in tonight&apos;s pool</span><span>Good luck, have fun.</span></footer>
        </main>
    );
}
