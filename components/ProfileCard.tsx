'use client';
import { motion } from 'framer-motion';
import { Globe, MapPin, Link as LinkIcon } from 'lucide-react';

export type ProfileData = {
  fullName: string;
  title: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
  theme?: string;
  accent?: string;
  handle?: string;
};

const THEMES: Record<string, {bg:string, ring:string}> = {
  ocean:   { bg: 'from-cyan-500/20 to-blue-500/10', ring: 'ring-cyan-300/40' },
  aurora:  { bg: 'from-emerald-500/20 to-indigo-500/10', ring: 'ring-emerald-300/40' },
  sunset:  { bg: 'from-pink-500/20 to-orange-400/10', ring: 'ring-pink-300/40' },
  galaxy:  { bg: 'from-fuchsia-500/20 to-violet-500/10', ring: 'ring-fuchsia-300/40' },
};

export default function ProfileCard({ data }: { data: ProfileData }) {
  const theme = THEMES[data.theme ?? 'ocean'] ?? THEMES['ocean'];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className={`glass rounded-3xl p-6 md:p-8 shadow-soft ring-1 ${theme.ring} bg-gradient-to-br ${theme.bg}`}
    >
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-white/10">
          {data.avatar ? (
            <img src={data.avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/50">
              {data.fullName?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl md:text-3xl font-semibold leading-tight gradient-text">
            {data.fullName}
          </h2>
          <p className="text-sm md:text-base text-slate-300/90">{data.title}</p>
        </div>
      </div>
      {data.bio && (<p className="mt-5 text-slate-300/90">{data.bio}</p>)}
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {data.location && (<div className="flex items-center gap-2 text-slate-300/90"><MapPin className="w-4 h-4" /> <span className="truncate">{data.location}</span></div>)}
        {data.website && (<div className="flex items-center gap-2 text-slate-300/90"><Globe className="w-4 h-4" /> <a href={data.website} className="underline truncate" target="_blank" rel="noreferrer">{data.website}</a></div>)}
        {data.handle && (<div className="flex items-center gap-2 text-slate-300/90"><LinkIcon className="w-4 h-4" /> <span className="truncate">/{data.handle}</span></div>)}
      </div>
    </motion.div>
  );
}