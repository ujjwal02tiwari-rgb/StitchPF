'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import ProfileCard, { ProfileData } from '@/components/ProfileCard';
import SwirlShare from '@/components/SwirlShare';
import { saveProfile, type SaveProfilePayload } from '@/lib/api';
import { useRouter } from 'next/navigation';

const DEFAULT_ACCENT = '#22d3ee' as const;

const DEFAULT: ProfileData = {
  fullName: '',
  bio: '',
  location: 'Bengaluru, India',
  website: '',
  avatar: '',
  theme: 'ocean',
  accent: DEFAULT_ACCENT,
};

const THEME_OPTIONS = ['ocean', 'aurora', 'sunset', 'galaxy'] as const;
type Theme = typeof THEME_OPTIONS[number];

/** ------------------------------- Page ------------------------------- */

export default function Home() {
  const [data, setData] = useState<ProfileData>(DEFAULT);
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [showSwirl, setShowSwirl] = useState(false);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    if (name === 'handle') setHandle(value.trim());
    else if (name === 'email') setEmail(value.trim());
    else setData((prev) => ({ ...prev, [name]: value }));
  };

  const onAvatar = (file: File | null) => {
    if (!file) return setData((prev) => ({ ...prev, avatar: '' }));
    const reader = new FileReader();
    reader.onload = () =>
      setData((prev) => ({ ...prev, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    alert('Link copied!');
  };

  const submit = async () => {
    try {
      setSaving(true);
      setLink(null);

      const safeTheme: Theme | undefined =
        data.theme && THEME_OPTIONS.includes(data.theme as Theme)
          ? (data.theme as Theme)
          : undefined;

      const payload: SaveProfilePayload = {
        email,
        handle,
        fullName: data.fullName,
        bio: data.bio || undefined,
        location: data.location || undefined,
        website: data.website || undefined,
        avatar: data.avatar || undefined,
        theme: safeTheme,
        accent: data.accent || undefined,
      };

      if (!payload.email) {
        alert('Email is required.');
        setSaving(false);
        return;
      }

      const result = await saveProfile(payload);

      if (!result?.handle) {
        throw new Error('Profile was saved but no handle was returned');
      }

      const savedHandle = result.handle;

      setSaving(false);
      const shareUrl = `${location.origin}/u/${savedHandle}`;
      setLink(shareUrl);
      setShowSwirl(true);

      setTimeout(async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: 'My Profile Card', url: shareUrl });
          } else {
            await navigator.clipboard.writeText(shareUrl);
          }
        } catch {}
        router.push(`/u/${savedHandle}`);
      }, 1600);
    } catch (err: any) {
      console.error('Save profile failed:', err);
      setSaving(false);
      alert(err.message || 'Failed to save profile');
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
          Enter your info, pick a theme, and instantly get a beautiful profile
          page to share.
        </p>

        <div className="mt-10 grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="glass rounded-3xl p-6 md:p-8">
            <div className="grid gap-4">
              {/* Email */}
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Email</label>
                <input
                  name="email"
                  value={email}
                  onChange={onChange}
                  type="email"
                  placeholder="you@example.com"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                  required
                />
              </div>

              {/* Handle */}
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">
                  Handle (unique URL)
                </label>
                <input
                  name="handle"
                  value={handle}
                  onChange={onChange}
                  placeholder="ujjwaltiwari"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                />
              </div>

              {/* Full Name */}
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Full Name</label>
                <input
                  name="fullName"
                  value={data.fullName}
                  onChange={onChange}
                  placeholder="Ujjwal Tiwari"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50"
                />
              </div>

              {/* Bio */}
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Bio</label>
                <textarea
                  name="bio"
                  value={data.bio}
                  onChange={onChange}
                  placeholder="I build fast, reliable services"
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:ring-2 ring-cyan-300/50 min-h-[88px]"
                />
              </div>

              {/* Location + Website */}
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

              {/* Theme + Accent */}
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
                  {/* TODO: plug your AccentPicker here */}
                </div>
              </div>

              {/* Avatar */}
              <div className="grid gap-2">
                <label className="text-sm text-slate-300/90">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => onAvatar(e.target.files?.[0] ?? null)}
                  className="file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-slate-200"
                />
              </div>

              {/* Submit + Copy */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={submit}
                  disabled={saving || !handle || !data.fullName}
                  className="px-4 py-2 rounded-xl bg-cyan-500/90 hover:bg-cyan-500 text-white disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Generate'}
                </button>

                {link && (
                  <button
                    onClick={copy}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white"
                  >
                    Copy Link
                  </button>
                )}
              </div>

              {link && (
                <p className="text-sm text-slate-300/80 mt-2">
                  Share URL: <span className="underline">{link}</span>
                </p>
              )}
            </div>
          </div>

          {/* Live Preview */}
          <div className="sticky top-8">
            {showSwirl && <SwirlShare onDone={() => setShowSwirl(false)} />}
            <ProfileCard data={{ ...data, handle }} />
          </div>
        </div>
      </section>
    </main>
  );
}
