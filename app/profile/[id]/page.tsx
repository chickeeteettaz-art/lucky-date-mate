import Link from "next/link";
import { notFound } from "next/navigation";
import users from "@/data/index.js";
import type { User } from "@/types/user";

const profiles = users as User[];

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const profile = profiles.find((candidate) => candidate.id === Number(id));
    if (!profile) notFound();

    return (
        <main className="profile-shell">
            <header className="topbar"><Link className="brand" href="/">lucky<span>date</span></Link><Link className="back-link" href="/game">Back to the wheel <span aria-hidden="true">↗</span></Link></header>
            <section className="profile-layout">
                <div className="profile-photo-wrap"><img className="profile-photo" src={profile.image} alt={`${profile.name} profile portrait`} /><span className="photo-note">A possible plot twist</span></div>
                <div className="profile-info">
                    <p className="eyebrow">Your wheel landed on</p>
                    <h1>{profile.name}, <em>{profile.age}</em></h1>
                    <p className="profile-meta">{profile.occupation} <span>/</span> {profile.location}</p>
                    <p className="profile-bio">{profile.bio}</p>
                    <div className="profile-facts"><div><span>Looking for</span><strong>{profile.lookingFor}</strong></div><div><span>Height</span><strong>{profile.height}</strong></div><div><span>Energy</span><strong>{profile.personality.join(" / ")}</strong></div></div>
                    <div className="interest-list"><span>Into</span>{profile.interests.map((interest) => <span className="interest" key={interest}>{interest}</span>)}</div>
                    <div className="profile-actions">
                        <a className="whatsapp-button" href={`https://wa.me/${profile.whatsapp}`} target="_blank" rel="noreferrer" aria-label={`Message ${profile.name} on WhatsApp`}>
                            <img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="" width="20" height="20" />
                            Message on WhatsApp
                        </a>
                        <Link className="start-button profile-cta" href="/game">Spin again <span aria-hidden="true">↗</span></Link>
                    </div>
                </div>
            </section>
        </main>
    );
}