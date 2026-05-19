import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import PostCard from "./PostCard";

type FeedProps = {
  selectedCategory: string;
  sortBy: "latest" | "trending";
  onNavigateToUser: (username: string) => void;
};

export default function Feed({ selectedCategory, sortBy, onNavigateToUser }: FeedProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Real-time subscription to feed with category and sorting parameters
  const posts = useQuery(api.posts.getFeed, {
    category: selectedCategory,
    sortBy: sortBy,
  });

  if (!isClient) {
    return (
      <div className="text-center py-20 text-zinc-500 italic">
        Préparation des éclats de rire... 🎭😂
      </div>
    );
  }

  // Handle loading state
  if (posts === undefined) {
    return (
      <div className="text-center py-20 text-zinc-500 italic">
        Chargement du feed le plus drôle... 😂
      </div>
    );
  }

  const feedItems = posts || [];

  return (
    <div className="space-y-6 pb-20">
      {feedItems.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 rounded-3xl p-8">
          <span className="text-5xl mb-4 block">🤫</span>
          <p className="text-zinc-500 text-sm italic">
            Aucune blague dans cette catégorie pour l'instant...<br />
            Sois le premier à faire rire tout le monde ! 😂
          </p>
        </div>
      ) : (
        feedItems.map((post: any) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onUserClick={onNavigateToUser}
          />
        ))
      )}
    </div>
  );
}