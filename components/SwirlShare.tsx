'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

type Props = { onDone?: () => void };

export default function SwirlShare({ onDone }: Props) {
  const controls = useAnimationControls();

  useEffect(() => {
    (async () => {
      await controls.start({ scale: 0.9, opacity: 0, rotate: 0, rotateY: 0, rotateX: 0 });
      await controls.start({ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 }});
      await controls.start({ rotateY: 25, rotateX: -10, transition: { duration: 0.4 }});
      await controls.start({ rotate: 360, scale: 0.95, transition: { duration: 0.8, ease: 'easeInOut' }});
      await controls.start({
        rotate: 720,
        rotateY: -25,
        rotateX: 10,
        scale: 1.05,
        boxShadow: '0 0 80px rgba(255,255,255,0.2)',
        filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.35))',
        transition: { duration: 0.9, ease: 'easeInOut' },
      });
      await controls.start({ rotate: 720, rotateY: 0, rotateX: 0, scale: 1, transition: { duration: 0.35 } });
      onDone?.();
    })();
  }, [controls, onDone]);

  return (
    <div className="relative mx-auto w-full max-w-md perspective p-4">
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={controls}
        className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/15 p-4"
      >
        <div id="cardSlot" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        {[...Array(24)].map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 1.8], y: [0, -40], x: [0, (i - 12) * 6] }}
            transition={{ delay: 0.15 + i * 0.015, duration: 0.8 }}
            className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white/60"
          />
        ))}
      </div>
    </div>
  );
}
