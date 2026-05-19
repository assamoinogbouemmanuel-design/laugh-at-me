import { useState } from "react";
import NavigationBar from "./NavigationBar";
import CreatePost from "./CreatePost";
import Feed from "./Feed";
import UserProfile from "./UserProfile";
import { withConvexProvider } from "../lib/convex";

const CATEGORIES = [
  { id: "all", label: "Tous" },
  { id: "blague", label: "😂 Blague" },
  { id: "meme", label: "🖼️ Meme" },
  { id: "fail", label: "💀 Fail" },
  { id: "animaux", label: "🐱 Animaux" },
  { id: "geek", label: "🧠 Geek" },
];

function MainApp() {
  const [activeView, setActiveView] = useState<"home" | "profile">("home");
  const [selectedProfileUsername, setSelectedProfileUsername] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<"latest" | "trending">("latest");

  const handleNavigate = (view: "home" | "profile", username?: string) => {
    setActiveView(view);
    if (view === "profile" && username) {
      setSelectedProfileUsername(username);
    }
    // Scroll smoothly to top on view changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-yellow-400 selection:text-black">
      
      {/* Premium Navigation Bar */}
      <NavigationBar 
        activeView={activeView} 
        onNavigate={handleNavigate} 
      />

      {/* Main Content Area */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        
        {activeView === "home" ? (
          <div className="space-y-6">
            
            {/* Header */}
            <header className="text-center py-6 sm:py-8 space-y-2">
              <h1 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent flex items-center justify-center gap-3">
                LaughHub <span className="inline-block hover:scale-120 hover:rotate-12 transition duration-300">😂</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base font-semibold max-w-sm mx-auto leading-relaxed">
                Le réseau social où on vient <span className="text-yellow-400 font-bold">juste pour rire</span>.
              </p>
            </header>

            {/* Post Creator Component */}
            <CreatePost />

            {/* Filters, Feed Sort & Settings Card */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 p-5 rounded-3xl space-y-5 shadow-xl">
              
              {/* Category Horizontal scroll list */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block pl-1">
                  🎯 Filtrer par catégorie
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 pr-2 scrollbar-none custom-scrollbar">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.label)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 border ${
                        selectedCategory === cat.label
                          ? "bg-zinc-800 text-yellow-400 border-yellow-400/25 shadow-md shadow-yellow-400/2"
                          : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Tabs Row */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">
                  🔥 Trier les blagues
                </span>
                
                <div className="bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 flex items-center gap-1">
                  <button
                    onClick={() => setSortBy("latest")}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition active:scale-95 ${
                      sortBy === "latest"
                        ? "bg-zinc-800 text-yellow-400 border border-yellow-400/10"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    ✨ Récents
                  </button>
                  
                  <button
                    onClick={() => setSortBy("trending")}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition active:scale-95 ${
                      sortBy === "trending"
                        ? "bg-zinc-800 text-yellow-400 border border-yellow-400/10"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    🔥 Hilarants
                  </button>
                </div>
              </div>
            </div>

            {/* Reactive Real-time Feed */}
            <Feed 
              selectedCategory={selectedCategory} 
              sortBy={sortBy} 
              onNavigateToUser={(username) => handleNavigate("profile", username)}
            />

          </div>
        ) : (
          /* User Profile Dashboard View */
          <UserProfile 
            username={selectedProfileUsername} 
            onBackToHome={() => handleNavigate("home")}
            onNavigateToUser={(username) => handleNavigate("profile", username)}
          />
        )}
      </main>
    </div>
  );
}

export default withConvexProvider(MainApp);
