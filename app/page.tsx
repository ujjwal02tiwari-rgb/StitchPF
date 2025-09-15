"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ProfileCard, { ProfileData } from "@/components/ProfileCard";
import SwirlShare from "@/components/SwirlShare";
import { saveProfile, type ProfileFormValues } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // 👈 Added

const DEFAULT_ACCENT = "#22d3ee" as const;

const DEFAULT: ProfileData = {
  fullName: "",
  title: "",
  bio: "",
  location: "Bengaluru, India",
  website: "",
  avatar: "",
  theme: "ocean",
  accent: DEFAULT_ACCENT,
};

const THEME_OPTIONS = ["ocean", "aurora", "sunset", "galaxy"] as const;
type Theme = (typeof THEME_OPTIONS)[number];

/** ---------- Accent Picker (unchanged) ---------- */
const SWATCHES = [
  "#22d3ee",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#f43f5e",
  "#ef4444",
  "#f59e0b",
  "#10b981",
] as const;

// ... keep your helper functions (clamp, hexToRgb, rgbToHsl, hslToHex, useHueFromHex, AccentPicker) unchanged ...

/** ------------------------------- Page ------------------------------- */

export default function Home() {
  const { data: session } = useSession(); // 👈 Grab email if logged in
  const [data, setData] = useState<ProfileData>(DEFAULT);
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState(""); // 👈 track email if no session
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [showSwirl, setShowSwirl] = useState(false);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.currentTarget;
    if (name === "handle") setHandle(value.trim());
    else if (name === "email") setEmail(value.trim());
    else setData((prev) => ({ ...prev, [name]: value }));
  };

  const onAvatar = (file: File | null) => {
    if (!file) return setData((prev) => ({ ...prev, avatar: "" }));
    const reader = new FileReader();
    reader.onload = () =>
      setData((prev) => ({ ...prev, avatar: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  const submit = async () => {
    try {
      setSaving(true);
      setLink(null);

      const safeTheme: Theme | undefined =
        data.theme && THEME_OPTIONS.includes(data.theme as Theme)
          ? (data.theme as Theme)
          : undefined;

      const payload: ProfileFormValues & { email: string } = {
        email: session?.user?.email ?? email, // ✅ always include
        handle,
        fullName: data.fullName,
        title: data.title,
        bio: data.bio || undefined,
        location: data.location || undefined,
        website: data.website || undefined,
        avatar: data.avatar || undefined,
        theme: safeTheme,
        accent: data.accent || undefined,
      };

      if (!payload.email) {
        alert("Email is required.");
        setSaving(false);
        return;
      }

      const { handle: savedHandle } = await saveProfile(payload);
      setSaving(false);
      const shareUrl = `${location.origin}/u/${savedHandle}`;
      setLink(shareUrl);
      setShowSwirl(true);

      setTimeout(async () => {
        try {
          if (navigator.share) {
            await navigator.share({ title: "My Profile Card", url: shareUrl });
          } else {
            await navigator.clipboard.writeText(shareUrl);
          }
        } catch {}
        router.push(`/u/${savedHandle}`);
      }, 1600);
    } catch (err: any) {
      setSaving(false);
      alert(err.message || "Failed to save");
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
              {/* 👇 If no session email, show email field */}
              {!session?.user?.email && (
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
              )}

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

              {/* ... keep the rest of your inputs (title, bio, location, website, theme, accent, avatar) unchanged ... */}

              <div className="mt-4 flex gap-3">
                <button
                  onClick={submit}
                  disabled={
                    saving || !handle || !data.fullName || !data.title
                  }
                  className="px-4 py-2 rounded-xl bg-cyan-500/90 hover:bg-cyan-500 text-white disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Generate"}
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
