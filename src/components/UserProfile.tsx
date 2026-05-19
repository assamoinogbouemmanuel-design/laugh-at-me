import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "./PostCard";

type UserProfileProps = {
  username: string;
  onBackToHome: () => void;
  onNavigateToUser: (username: string) => void;
};

export default function UserProfile({ username, onBackToHome, onNavigateToUser }: UserProfileProps) {
  // Fetch profile and all posts from this user in real-time
  const profileData = useQuery(api.users.getUserProfile, { username });

  if (profileData === undefined) {
    return (
      <div className="text-center py-20 text-zinc-500 italic">
        Analyse du profil le plus marrant... 🔎😂
      </div>
    );
  }

  if (profileData === null) {
    return (
      <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-lg mx-auto">
        <span className="text-6xl mb-4 block">👻</span>
        <h3 className="text-xl font-bold text-white mb-2">Profil Introuvable</h3>
        <p className="text-zinc-400 text-sm mb-6">L'humoriste @{username} s'est éclipsé dans les coulisses !</p>
        <button
          onClick={onBackToHome}
          className="bg-yellow-400 text-black font-extrabold px-6 py-3 rounded-2xl text-sm transition hover:bg-yellow-300"
        >
          🏠 Retour à l'accueil
        </button>
      </div>
    );
  }

  const { user, posts } = profileData;

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-20">
      
      {/* Profile Header Card */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl shadow-black/20">
        
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-yellow-400 shadow-lg shadow-yellow-400/5"
              alt={user.name}
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-yellow-400/10 border-2 border-yellow-400/30 text-yellow-400 rounded-3xl flex items-center justify-center text-5xl">
              🤪
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{user.name}</h2>
              <p className="text-yellow-400 font-bold text-sm">@{user.username}</p>
            </div>
            
            <p className="text-zinc-300 text-sm leading-relaxed max-w-md font-medium">
              {user.bio || "Je fais rire le monde 😂"}
            </p>
            
            <p className="text-xs text-zinc-500 font-medium">
              📅 Membre depuis le {new Date(user.joinedAt).toLocaleDateString("fr-FR", {
                month: "long",
                year: "numeric"
              })}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-zinc-800/80">
          <div className="bg-zinc-950/50 border border-zinc-800/60 rounded-2xl p-4 text-center">
            <span className="text-2xl sm:text-3xl font-black text-white block mb-1">
              {posts.length}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
              📜 Blagues partagées
            </span>
          </div>

          <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-2xl p-4 text-center group hover:border-yellow-400/30 transition">
            <span className="text-2xl sm:text-3xl font-black text-yellow-400 block mb-1 group-hover:scale-110 transition duration-300">
              😂 {user.totalLaughsReceived || 0}
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
              Total Laughs Reçus
            </span>
          </div>
        </div>
      </div>

      {/* User's Posts Feed */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white pl-2">
          😂 Les éclats de rire de @{user.username}
        </h3>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/40 border border-zinc-800 border-dashed rounded-3xl p-8">
            <span className="text-4xl mb-3 block">🥱</span>
            <p className="text-zinc-500 text-sm italic">
              Cette scène est bien calme...<br />Aucune blague publiée pour l'instant !
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUserClick={onNavigateToUser}
            />
          ))
        )}
      </div>
    </div>
  );
}
