import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";

type NavigationBarProps = {
  activeView: string;
  onNavigate: (view: "home" | "profile", username?: string) => void;
};

export default function NavigationBar({ activeView, onNavigate }: NavigationBarProps) {
  const { user, isSignedIn } = useUser();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate("home")} 
          className="flex items-center gap-2 cursor-pointer group hover:scale-102 transition"
        >
          <span className="text-3xl group-hover:rotate-12 transition duration-300">😂</span>
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
            LaughHub
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("home")}
            className={`font-semibold text-sm px-4 py-2 rounded-full transition ${
              activeView === "home"
                ? "bg-zinc-800 text-yellow-400 border border-yellow-400/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            🏠 Accueil
          </button>

          {isSignedIn && user && (
            <button
              onClick={() => {
                const username = user.username || user.emailAddresses[0].emailAddress.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
                onNavigate("profile", username);
              }}
              className={`font-semibold text-sm px-4 py-2 rounded-full transition ${
                activeView === "profile" && user
                  ? "bg-zinc-800 text-yellow-400 border border-yellow-400/20"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🧑‍💻 Mon Profil
            </button>
          )}
        </div>

        {/* Authentication Button */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <div className="flex items-center gap-3 border border-zinc-800 bg-zinc-900/50 py-1.5 pl-4 pr-2 rounded-full">
              <span className="text-xs text-zinc-400 hidden sm:inline">@{user.username || "funny_user"}</span>
              <UserButton afterSignOutUrl="/" appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-full border border-yellow-400/35"
                }
              }} />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold px-6 py-2.5 rounded-full text-sm shadow-lg shadow-yellow-400/10 active:scale-95 transition">
                ⚡ Rejoindre
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
