import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <main className="landing-shell">
            <nav className="topbar"><span className="brand">lucky<span>date</span></span><span className="nav-note">A little chance never hurt</span></nav>
            <section className="landing-content">
                <p className="eyebrow">A speed dating game for the curious</p>
                <h1>Meet your<br /><em>maybe.</em></h1>
                <p className="landing-copy">No swiping. No overthinking. Just a spin, a spark, and someone new to talk to.</p>
                <Link className="start-button" href="/game">Enter the roulette <span aria-hidden="true">↗</span></Link>
            </section>
            <Link className="landing-wheel" href="/game" aria-label="Start spinning the roulette wheel">
                <Image src="/roulette-wheel.svg" alt="Roulette wheel with date and bonus options" width={620} height={620} priority />
                <span>Start spinning <b aria-hidden="true">↗</b></span>
            </Link>
            <div className="landing-stamp"><span>3</span><small>spins<br />to start</small></div>
            <footer className="landing-footer"><span>Lucky Date Mate / 2026</span><span>Made for unexpected hellos</span></footer>
        </main>
    );
}