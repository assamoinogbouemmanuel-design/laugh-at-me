import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LaughButton({ postId, initialLaughs = 0 }: { 
  postId: string; 
  initialLaughs: number;
}) {
  const [laughs, setLaughs] = useState(initialLaughs);
  const [isAnimating, setIsAnimating] = useState(false);
  const addLaugh = useMutation(api.posts.addLaugh);

  const handleLaugh = async () => {
    setIsAnimating(true);
    await addLaugh({ postId });
    setLaughs(prev => prev + 1);
    
    setTimeout(() => setIsAnimating(false), 800);
  };

  return (
    <button
      onClick={handleLaugh}
      className="flex items-center gap-3 text-3xl hover:scale-110 active:scale-125 transition-all"
    >
      <span className={`transition-transform ${isAnimating ? "scale-150" : ""}`}>😂</span>
      <span className="text-xl font-bold text-white">{laughs}</span>
    </button>
  );
}