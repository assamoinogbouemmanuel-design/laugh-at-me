import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignInButton } from "@clerk/clerk-react";

const CATEGORIES = [
  { id: "blague", label: "😂 Blague" },
  { id: "meme", label: "🖼️ Meme" },
  { id: "fail", label: "💀 Fail" },
  { id: "animaux", label: "🐱 Animaux" },
  { id: "geek", label: "🧠 Geek" },
];

const GOLD_GRADIENTS = [
  "linear-gradient(135deg, #FFE066 0%, #F5C400 100%)", // Radiant gold
  "linear-gradient(135deg, #FFF3B0 0%, #D4AF37 100%)", // Metallic gold
  "linear-gradient(135deg, #FAD961 0%, #F76B1C 100%)", // Amber gold
  "linear-gradient(135deg, #FCE38A 0%, #F38181 100%)", // Rose gold hue
  "linear-gradient(135deg, #FFE57F 0%, #FFC107 100%)", // Honey gold
];

// High-fidelity full-screen Golden Confetti Rain Component
function GoldenConfettiRain() {
  const pieces = Array.from({ length: 75 }).map((_, i) => {
    const width = 8 + Math.random() * 8;
    const height = width * (1.6 + Math.random() * 0.8);
    return {
      id: i,
      left: Math.random() * 100, // percentage horizontal start
      delay: Math.random() * 3, // staggered delay in seconds
      duration: 3.5 + Math.random() * 2.5, // speed of falling
      gradient: GOLD_GRADIENTS[Math.floor(Math.random() * GOLD_GRADIENTS.length)],
      width,
      height,
      rotation: Math.random() * 360,
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes confetti-fall {
          0% {
            transform: translateY(-50px) rotate3d(1, 1, 1, var(--start-rot, 0deg));
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate3d(1, 1, 1, var(--end-rot, 720deg));
            opacity: 0;
          }
        }
        @keyframes confetti-sway {
          0% {
            margin-left: -25px;
          }
          100% {
            margin-left: 25px;
          }
        }
      `}} />
      {pieces.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            background: p.gradient,
            borderRadius: "2px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
            top: "-50px",
            opacity: 0,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards, confetti-sway 1.8s ease-in-out ${p.delay}s infinite alternate`,
            "--start-rot": `${p.rotation}deg`,
            "--end-rot": `${p.rotation + 360 + Math.random() * 540}deg`,
          } as any}
        />
      ))}
    </div>
  );
}

export default function CreatePost() {
  const { isSignedIn, user } = useUser();
  const [text, setText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("blague");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPost = useMutation(api.posts.createPost);
  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const syncUser = useMutation(api.users.syncUser);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      // Auto-sync user in Convex db with Clerk details
      await syncUser({
        customUsername: user?.username || undefined,
        customName: user?.fullName || user?.firstName || undefined,
        customEmail: user?.primaryEmailAddress?.emailAddress || undefined,
        customAvatar: user?.imageUrl || undefined,
      });

      let mediaUrl = undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: "POST",
          body: file,
        });
        const { storageId } = await res.json();
        mediaUrl = storageId;
      }

      await createPost({
        text: text.trim(),
        mediaUrl,
        category: CATEGORIES.find(c => c.id === selectedCategory)?.label || "😂 Blague",
        customEmail: user?.primaryEmailAddress?.emailAddress || undefined,
      });

      // Clear Form on success
      setText("");
      setFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Show sleek custom success message & trigger golden rain shower!
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000); // 5 seconds of golden celebration
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      alert(`Erreur lors de la publication 😢 : ${errorMessage}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Signed out View: Call to action card
  if (!isSignedIn) {
    return (
      <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-4 mb-10 shadow-xl shadow-yellow-400/2">
        <span className="text-5xl block animate-bounce">🎭</span>
        <h3 className="text-lg sm:text-xl font-black text-white">Tu as une blague hilarante à raconter ?</h3>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
          Rejoins le club LaughHub pour publier tes blagues, uploader tes memes préférés et collecter des laughs en pagaille ! 😂
        </p>
        <SignInButton mode="modal">
          <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-8 py-3 rounded-2xl text-sm transition shadow-lg shadow-yellow-400/10 active:scale-95">
            ⚡ Se connecter et publier
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <>
      {/* Dynamic Gold Confetti Rain Shower */}
      {showSuccess && <GoldenConfettiRain />}

      <form 
        onSubmit={handleSubmit} 
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 mb-10 shadow-xl relative overflow-hidden"
      >
        {showSuccess && (
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-2 animate-fade-in">
            <span className="text-5xl animate-spin">😂</span>
            <h4 className="text-lg font-black text-yellow-400">Blague publiée avec succès !</h4>
            <p className="text-xs text-zinc-400 font-semibold">Prépare-toi à faire exploser le compteur de rire !</p>
          </div>
        )}

        {/* Editor Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Qu'est-ce qui t'a fait pleurer de rire aujourd'hui, @${user?.username || "humoriste"} ? 🤪`}
          className="w-full h-28 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 sm:p-5 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-y text-zinc-200 placeholder-zinc-500 font-medium text-sm sm:text-base transition"
          maxLength={500}
        />

        {/* Categories Row */}
        <div className="mt-4">
          <label className="text-xs font-bold text-zinc-500 block mb-2 uppercase tracking-wide">
            🏷️ Choisis une catégorie :
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition border active:scale-95 ${
                  selectedCategory === cat.id
                    ? "bg-yellow-400 text-black border-yellow-400 shadow-md shadow-yellow-400/5"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Upload button & file preview */}
        <div className="mt-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="cursor-pointer bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>📁 Importer une image / meme</span>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-rose-500 font-bold hover:underline"
              >
                Supprimer l'image ❌
              </button>
            )}
          </div>

          {preview && (
            <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 max-h-64 flex justify-center">
              <img src={preview} className="max-h-64 object-contain" alt="Selected meme" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="mt-6 w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-extrabold py-3.5 rounded-2xl text-base shadow-lg shadow-yellow-400/5 active:scale-98 transition duration-200"
        >
          {loading ? "Mise en scène de la blague..." : "Publier l'éclat de rire 😂"}
        </button>
      </form>
    </>
  );
}