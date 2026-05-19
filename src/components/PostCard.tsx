import { useState } from "react";
import LaughButton from "./LaughButton.tsx";
import CommentSection from "./CommentSection.tsx";

type Post = {
  _id: string;
  text: string;
  mediaUrl?: string;
  category?: string;
  laughs: number;
  createdAt: number;
  username: string;
  userAvatar?: string;
};

type PostCardProps = {
  post: Post;
  onUserClick?: (username: string) => void;
};

export default function PostCard({ post, onUserClick }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 hover:border-yellow-400/40 rounded-3xl p-6 transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-yellow-400/5">
      
      {/* Post Header */}
      <div className="flex items-center gap-3.5 mb-4">
        <div 
          onClick={() => onUserClick?.(post.username)}
          className="cursor-pointer group relative"
        >
          {post.userAvatar ? (
            <img 
              src={post.userAvatar} 
              className="w-11 h-11 rounded-2xl object-cover border border-zinc-800 group-hover:border-yellow-400 transition" 
              alt={post.username} 
            />
          ) : (
            <div className="w-11 h-11 bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 rounded-2xl flex items-center justify-center text-xl group-hover:bg-yellow-400/20 transition">
              😂
            </div>
          )}
        </div>
        <div>
          <p 
            onClick={() => onUserClick?.(post.username)}
            className="font-bold text-zinc-100 hover:text-yellow-400 cursor-pointer transition text-sm sm:text-base"
          >
            @{post.username}
          </p>
          <p className="text-[10px] sm:text-xs text-zinc-500 font-medium">
            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
        
        {/* Category Tag */}
        {post.category && (
          <span className="ml-auto px-4 py-1.5 bg-zinc-800/80 border border-zinc-700/50 text-[10px] sm:text-xs font-bold text-zinc-300 rounded-full tracking-wide">
            🏷️ {post.category}
          </span>
        )}
      </div>

      {/* Post content */}
      <p className="text-base sm:text-lg leading-relaxed text-zinc-200 mb-5 break-words font-medium whitespace-pre-wrap">
        {post.text}
      </p>
      
      {/* Post image */}
      {post.mediaUrl && (
        <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 mb-5 bg-zinc-950">
          <img 
            src={post.mediaUrl} 
            className="w-full max-h-[480px] object-contain mx-auto group-hover:scale-101 transition duration-500" 
            alt="meme content" 
            loading="lazy"
          />
        </div>
      )}

      {/* Action Buttons Row */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-zinc-800/50">
        {/* Laugh Button */}
        <LaughButton postId={post._id} initialLaughs={post.laughs} />

        {/* Comment Toggle Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition duration-200 active:scale-95 ${
            showComments 
              ? "bg-zinc-800 text-yellow-400 border border-yellow-400/20" 
              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
          }`}
        >
          <span>💬</span>
          <span>{showComments ? "Fermer" : "Répondre"}</span>
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <CommentSection postId={post._id} />
      )}
    </div>
  );
}