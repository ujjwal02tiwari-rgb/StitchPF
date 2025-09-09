'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard, { ProfileData } from '@/components/ProfileCard';

const DEFAULT: ProfileData = {
  fullName: '',
  title: '',
  bio: '',
  location: 'Bengaluru, India',
  website: '',
  avatar: '',
  theme: 'ocean',
  accent: '#22d3ee',
};

export default function Home() {
  const [data, setData] = useState<ProfileData>(DEFAULT);
  const [handle, setHandle] = useState('');
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);

   const onChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
 ) => {
  const { name, value } = e.currentTarget;
   if (name === 'handle') setHandle(value.trim());
   else setData(prev => ({ ...prev, [name]: value })); 
  };

  const onAvatar = (file: File | null) => {
    if (!file) return setData(prev => ({...prev, avatar: ''}));
    const reader = new FileReader();
    reader.onload = () => setData(prev => ({...prev, avatar: String(reader.result)}));
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setSaving(true);
    setLink(null);
    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, ...data }),
    });
    const json = await res.json();
    setSaving(false);
    if (res.ok) setLink(`${location.origin}/u/${json.handle}`);
    else alert(json.error || 'Failed to save profile');
  };

  const copy = async () => {
    if (link) {
      await navigator.clipboard.writeText(link);
      alert('Link copied!');
    }
  };

  return (
    <main className="min-h-screen">
      <section className="max-w-7xl mx-auto px-5 py-10 md:py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Build a <span className="gradient-text">shareable profile card</span>
        </motion.h1>
        <p className="mt-4 text-slate-300/90 max-w-2xl">
          Enter your info, pick a theme, and instantly get a beautiful profile page to share—just like LinkedIn’s public profile, but snappier.
        </p>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Handle (unique URL)</label>
                <input
                  name="handle"
                  value={handle}
                  onChange={onChange}
                  placeholder="neerajbakshi"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Full Name</label>
                <input
                  name="fullName"
                  value={data.fullName}
                  onChange={onChange}
                  placeholder="Neeraj Bakshi"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Title / Headline</label>
                <input
                  name="title"
                  value={data.title}
                  onChange={onChange}
                  placeholder="SDE II — Java, Spring Boot, AWS"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Bio</label>
                <textarea
                  name="bio"
                  value={data.bio}
                  onChange={onChange}
                  placeholder="I build fast, reliable services and love distributed systems."
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50 min-h-[88px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm text-slate-300/90">Location</label>
                  <input
                    name="location"
                    value={data.location}
                    onChange={onChange}
                    placeholder="Bengaluru, India"
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-slate-300/90">Website</label>
                  <input
                    name="website"
                    value={data.website}
                    onChange={onChange}
                    placeholder="https://yourdomain.com"
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm text-slate-300/90">Theme</label>
                  <select
                    name="theme"
                    value={data.theme}
                    onChange={onChange}
                    className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                  >
                    <option value="ocean">Ocean</option>
                    <option value="aurora">Aurora</option>
                    <option value="sunset">Sunset</option>
                    <option value="galaxy">Galaxy</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm text-slate-300/90">Accent</label>
                  <input
                    name="accent"
                    type="color"
                    value={data.accent}
                    onChange={onChange}
                    className="h-10 rounded-xl bg-white/5 border border-white/10"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Avatar</label>
                <input
                   type="file"
                   accept="image/*"
                   onChange={(e) => onAvatar(e.currentTarget.files?.[0] ?? null)}
                   className="px-3 py-2 rounded-xl bg-white/5 border border-white/10"
               />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={submit}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold transition disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Generate Link'}
                </button>
                {link && (
                  <button
                    onClick={copy}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10"
                  >
                    Copy Link
                  </button>
                )}
              </div>
              {link && (
                <div className="text-sm text-slate-300/90 truncate">Your link: <a className="underline" href={link}>{link}</a></div>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="sticky top-8">
            <ProfileCard data={{...data, handle}} />
          </div>
        </div>
      </section>
    </main>
  );
}
