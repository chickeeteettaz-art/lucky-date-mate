"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RouletteWheel from "@/components/RouletteWheel";
import users from "@/data/index.js";
import type { User } from "@/types/user";

const profiles = users as User[];

type ResultMessage = {
    kind: "match" | "bonus" | "retry" | "penalty";
    eyebrow: string;
    title: string;
    body: string;
    action: string;
};

function getCandidateIds() {
    const ids = new Set<number>();
    while (ids.size < 3) ids.add(Math.floor(Math.random() * profiles.length));
    return [...ids];
}

export default function GamePage() {
    const router = useRouter();
    const [spins, setSpins] = useState(3);
    const [points, setPoints] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [candidateIds, setCandidateIds] = useState([0, 1, 2]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [status, setStatus] = useState("Three chances. One conversation worth finding.");
    const [resultMessage, setResultMessage] = useState<ResultMessage | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const audioContext = useRef<AudioContext | null>(null);
    const soundEnabledRef = useRef(false);
    const ambientTimer = useRef<number | null>(null);

    const wheelOptions = [
        ...candidateIds.map((id) => ({ label: profiles[id].name, detail: "Meet me", kind: "profile" as const, image: profiles[id].image })),
        { label: "+2 spins", detail: "More chances", kind: "bonus" as const },
        { label: "Try again", detail: "Keep spinning", kind: "bonus" as const },
        { label: "-2 points", detail: "Ouch", kind: "game-over" as const },
    ];

    function getAudioContext() {
        if (!audioContext.current || audioContext.current.state === "closed") audioContext.current = new AudioContext();
        if (audioContext.current.state === "suspended") void audioContext.current.resume();
        return audioContext.current;
    }

    function playTone(frequencies: number[], duration = 0.22, type: OscillatorType = "sine", volume = 0.12) {
        if (!soundEnabledRef.current) return;
        const context = getAudioContext();
        if (context.state === "closed") return;
        const now = context.currentTime;
        const gain = context.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        gain.connect(context.destination);
        frequencies.forEach((frequency, index) => {
            const oscillator = context.createOscillator();
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            oscillator.detune.value = index * 3;
            oscillator.connect(gain);
            oscillator.start(now);
            oscillator.stop(now + duration);
        });
    }

    function playSequence(frequencies: number[], noteDuration = 0.18, volume = 0.1) {
        if (!soundEnabledRef.current) return;
        frequencies.forEach((frequency, index) => {
            window.setTimeout(() => playTone([frequency], noteDuration, "sine", volume), index * noteDuration * 1000);
        });
    }

    function playProfileSoundbite(profile: User) {
        const scale = [261.63, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33, 659.25, 783.99];
        const phrase: number[] = [];
        let seed = profile.id * 97 + 11;
        let delay = 0;

        for (let index = 0; index < 5; index += 1) {
            seed = (seed * 23 + 17) % 997;
            phrase.push(scale[seed % scale.length]);
            const duration = 0.12 + (seed % 3) * 0.04;
            window.setTimeout(() => playTone([phrase[index]], duration, index % 2 === 0 ? "triangle" : "sine", 0.14), delay);
            delay += duration * 1000;
        }

        window.setTimeout(() => playTone([phrase[0], phrase[2]], 0.36, "triangle", 0.1), delay);
    }

    function playLoungePhrase() {
        const chords = [
            [130.81, 155.56, 196, 233.08],
            [110, 130.81, 164.81, 196],
            [146.83, 174.61, 220, 261.63],
            [123.47, 146.83, 185, 220],
        ];

        chords.forEach((chord, index) => {
            const delay = index * 720;
            window.setTimeout(() => {
                playTone(chord, 0.68, "triangle", 0.035);
                playTone([chord[0] / 2], 0.55, "sine", 0.045);
            }, delay);
        });
    }

    function startAmbientMusic() {
        playLoungePhrase();
        ambientTimer.current = window.setInterval(() => {
            playLoungePhrase();
        }, 3000);
    }

    function toggleSound() {
        const nextEnabled = !soundEnabled;
        setSoundEnabled(nextEnabled);
        soundEnabledRef.current = nextEnabled;
        getAudioContext();
        if (nextEnabled) {
            startAmbientMusic();
            playSequence([392, 494], 0.16, 0.08);
        } else {
            if (ambientTimer.current) window.clearInterval(ambientTimer.current);
            ambientTimer.current = null;
        }
    }

    useEffect(() => () => {
        if (ambientTimer.current) window.clearInterval(ambientTimer.current);
        void audioContext.current?.close();
    }, []);

    useEffect(() => {
        const randomizeCandidates = window.setTimeout(() => setCandidateIds(getCandidateIds()), 0);
        return () => window.clearTimeout(randomizeCandidates);
    }, []);

    function spin() {
        if (isSpinning || spins < 1) return;
        if (!soundEnabled) toggleSound();
        soundEnabledRef.current = true;
        setSpins((current) => current - 1);
        playSequence([220, 277, 330, 392, 440], 0.13, 0.08);
        setIsSpinning(true);
        setStatus("The wheel is choosing your next conversation...");

        window.setTimeout(() => {
            const result = Math.floor(Math.random() * 6);
            setIsSpinning(false);

            if (result < 3) {
                playProfileSoundbite(profiles[candidateIds[result]]);
                setPoints((current) => current + 10);
                setStatus("It is a match. You earned 10 points.");
                setResultMessage({
                    kind: "match",
                    eyebrow: "A spark found you",
                    title: `Meet ${profiles[candidateIds[result]].name}`,
                    body: "You landed on a potential date and earned 10 points.",
                    action: "See their profile",
                });
                window.setTimeout(() => router.push(`/profile/${profiles[candidateIds[result]].id}`), 1400);
                return;
            }

            if (result === 3) {
                playSequence([523, 659, 784], 0.18, 0.11);
                setSpins((current) => current + 2);
                setPoints((current) => current + 2);
                setStatus("Lucky break: 2 more spins and 2 points.");
                setResultMessage({
                    kind: "bonus",
                    eyebrow: "Lucky break",
                    title: "+2 spins",
                    body: "The wheel gave you two more chances and 2 bonus points.",
                    action: "Keep playing",
                });
                return;
            }

            if (result === 4) {
                playSequence([330, 392, 440], 0.2, 0.08);
                setSpins((current) => current + 1);
                setStatus("Try again. Your spin is returned.");
                setResultMessage({
                    kind: "retry",
                    eyebrow: "Not quite",
                    title: "Try again",
                    body: "That spin is returned. The next choice could be the one.",
                    action: "Spin again",
                });
                return;
            }

            playSequence([294, 247, 196, 147], 0.22, 0.11);
            setPoints((current) => Math.max(0, current - 2));
            setStatus("Ouch. You lost 2 points.");
            setResultMessage({
                kind: "penalty",
                eyebrow: "A little plot twist",
                title: "-2 points",
                body: "No match this time, but there are still chances left.",
                action: "Continue",
            });
            if (spins === 1) {
                window.setTimeout(() => {
                    setResultMessage(null);
                    setIsGameOver(true);
                }, 1200);
            }
        }, 950);
    }

    function startNewRound() {
        setCandidateIds(getCandidateIds());
        setSpins(3);
        setPoints(0);
        setStatus("A fresh round is ready. Three chances, one conversation worth finding.");
        setIsGameOver(false);
    }

    return (
        <main className="game-shell">
            <header className="topbar">
                <Link className="brand" href="/">lucky<span>date</span></Link>
                <div className="game-stats">
                    <div className="score-counter"><strong>{points}</strong><span> points</span></div>
                    <div className="spin-counter"><strong>{spins}</strong><span> spins</span></div>
                    <button className={`sound-toggle ${soundEnabled ? "sound-toggle--on" : ""}`} type="button" onClick={toggleSound} aria-pressed={soundEnabled}>
                        <span aria-hidden="true">{soundEnabled ? "◖))" : "♪"}</span> {soundEnabled ? "Sound on" : "Sound off"}
                    </button>
                </div>
            </header>
            <section className="game-intro">
                <p className="eyebrow">The conversation roulette</p>
                <h1>Let chance<br /><em>start something.</em></h1>
                <p className="game-copy">Every spin opens a door. Land on a profile and see where the conversation goes.</p>
            </section>
            <section className="wheel-panel" aria-label="Speed dating roulette">
                <RouletteWheel options={wheelOptions} isSpinning={isSpinning} onSpin={spin} />
                <p className="wheel-status" aria-live="polite">{status}</p>
                <div className="wheel-legend"><span><i className="dot dot--date" />Date +10</span><span><i className="dot dot--bonus" />Bonus / retry</span><span><i className="dot dot--end" />Lose 2</span></div>
            </section>
            <footer className="game-footer"><span>01 / 30 profiles in tonight&apos;s pool</span><span>Good luck, have fun.</span></footer>
            {resultMessage && (
                <div className="result-backdrop" role="presentation">
                    <section className={`result-dialog result-dialog--${resultMessage.kind}`} role="dialog" aria-modal="true" aria-labelledby="result-title">
                        <button className="result-close" type="button" onClick={() => setResultMessage(null)} aria-label="Close result message">×</button>
                        <div className="result-icon" aria-hidden="true">{resultMessage.kind === "match" ? "✦" : resultMessage.kind === "bonus" ? "+" : resultMessage.kind === "retry" ? "↻" : "−"}</div>
                        <p className="eyebrow">{resultMessage.eyebrow}</p>
                        <h2 id="result-title">{resultMessage.title}</h2>
                        <p>{resultMessage.body}</p>
                        <button className="result-action" type="button" onClick={() => setResultMessage(null)}>{resultMessage.action}</button>
                    </section>
                </div>
            )}
            {isGameOver && (
                <div className="game-over-backdrop" role="presentation">
                    <section className="game-over-dialog" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
                        <div className="game-over-ring" aria-hidden="true"><span>0</span></div>
                        <p className="eyebrow">The wheel has gone quiet</p>
                        <h2 id="game-over-title">Game over</h2>
                        <p>Your spins are all used up. A new round brings three new chances.</p>
                        <button className="result-action" type="button" onClick={startNewRound}>Start a new round</button>
                    </section>
                </div>
            )}
        </main>
    );
}
