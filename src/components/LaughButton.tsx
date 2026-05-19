import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

type Particle = {
  id: number;
  x: number;
  y: number;
  color: string;
  emoji?: string;
  size: number;
};

const COLORS = [
  "bg-yellow-400",
  "bg-amber-400",
  "bg-orange-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-teal-400",
  "bg-green-400"
];

const EMOJIS = ["😂", "🤣", "✨", "💛", "🎉", "🔥"];

export default function LaughButton({ postId, initialLaughs = 0 }: { 
  postId: string; 
  initialLaughs: number;
}) {
  const [laughs, setLaughs] = useState(initialLaughs);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const addLaugh = useMutation(api.posts.addLaugh);

  const handleLaugh = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Spawn 18 vibrant custom pastilles and emojis
    const newParticles: Particle[] = [];
    const particleCount = 18;
    
    for (let i = 0; i < particleCount; i++) {
      // Calculate random radial velocity
      const angle = (i * 2 * Math.PI) / particleCount + (Math.random() - 0.5) * 0.35;
      const distance = 55 + Math.random() * 75; // Explosion radius in px
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      
      const isEmoji = Math.random() > 0.6; // 40% emojis, 60% colored pastille dots
      
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        emoji: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
        size: isEmoji ? 16 + Math.random() * 6 : 8 + Math.random() * 8,
      });
    }
    
    setParticles(newParticles);
    
    // Optimistically increment client-side, run mutation asynchronously
    setLaughs(prev => prev + 1);
    
    try {
      await addLaugh({ postId: postId as any });
    } catch (err) {
      console.error("Failed to register laugh:", err);
      // Rollback on failure
      setLaughs(prev => Math.max(0, prev - 1));
    }
    
    // Clear particles and end trigger animations after 800ms
    setTimeout(() => {
      setIsAnimating(false);
      setParticles([]);
    }, 850);
  };

  return (
    <div className="relative inline-block">
      
      {/* Premium Particle Splash Elements */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none rounded-full flex items-center justify-center select-none z-30 opacity-0"
          style={{
            left: "50%",
            top: "50%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            marginLeft: `-${p.size / 2}px`,
            marginTop: `-${p.size / 2}px`,
            animation: "splash-burst 850ms cubic-bezier(0.1, 0.8, 0.25, 1) forwards",
            "--x": `${p.x}px`,
            "--y": `${p.y}px`,
          } as any}
        >
          {p.emoji ? (
            <span style={{ fontSize: `${p.size}px` }}>{p.emoji}</span>
          ) : (
            <div className={`w-full h-full rounded-full ${p.color} shadow-lg shadow-yellow-500/10`} />
          )}
        </div>
      ))}

      {/* Inline styles injection for clean CSS variable animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes splash-burst {
          0% {
            transform: translate(0, 0) scale(0.3) rotate(0deg);
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(0) rotate(140deg);
            opacity: 0;
          }
        }
      `}} />

      {/* The Interactive Premium Trigger Button */}
      <button
        onClick={handleLaugh}
        className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900/60 hover:bg-zinc-800/80 border border-zinc-800/80 rounded-2xl hover:scale-105 active:scale-95 hover:border-yellow-400/20 active:border-yellow-400/40 transition duration-300 relative group overflow-hidden select-none"
      >
        <span 
          className={`text-xl transition duration-500 inline-block ${
            isAnimating ? "animate-bounce scale-150 rotate-12" : "group-hover:rotate-12 group-hover:scale-115"
          }`}
        >
          😂
        </span>
        <span className="text-xs font-extrabold text-zinc-400 group-hover:text-yellow-400 transition-colors">
          {laughs}
        </span>
      </button>
    </div>
  );
}