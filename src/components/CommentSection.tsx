import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignInButton } from "@clerk/clerk-react";

type CommentSectionProps = {
  postId: string;
};

export default function CommentSection({ postId }: CommentSectionProps) {
  const { isSignedIn, user } = useUser();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time subscription to comments for this post
  const comments = useQuery(api.comments.getComments, { postId: postId as any });
  const addComment = useMutation(api.comments.addComment);
  const syncUser = useMutation(api.users.syncUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Sync user profile before commenting with Clerk details
      await syncUser({
        customUsername: user?.username || undefined,
        customName: user?.fullName || user?.firstName || undefined,
        customEmail: user?.primaryEmailAddress?.emailAddress || undefined,
        customAvatar: user?.imageUrl || undefined,
      });
      
      await addComment({
        postId: postId as any,
        text: commentText.trim(),
        customEmail: user?.primaryEmailAddress?.emailAddress || undefined,
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Erreur lors de la publication du commentaire 😢 : ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-zinc-800/80">
      <h4 className="font-bold text-sm text-zinc-300 mb-4 flex items-center gap-2">
        💬 Commentaires {(comments && comments.length > 0) ? `(${comments.length})` : ""}
      </h4>

      {/* List of comments */}
      <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        {!comments ? (
          <div className="text-zinc-600 text-xs py-2">Chargement...</div>
        ) : comments.length === 0 ? (
          <p className="text-zinc-500 text-sm italic py-2">Aucun commentaire. Sois le premier à faire rire l'auteur ! 😂</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 bg-zinc-950/40 border border-zinc-800/40 p-3.5 rounded-2xl">
              {comment.userAvatar ? (
                <img
                  src={comment.userAvatar}
                  className="w-8 h-8 rounded-xl object-cover border border-zinc-800"
                  alt={comment.username}
                />
              ) : (
                <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center text-sm">
                  🤪
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-yellow-400">@{comment.username}</span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(comment.createdAt).toLocaleDateString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      {isSignedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Ajoute ton commentaire drôle... 🤪"
            className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 rounded-xl px-4 py-2.5 text-sm text-white transition"
            maxLength={250}
          />
          <button
            type="submit"
            disabled={isSubmitting || !commentText.trim()}
            className="bg-yellow-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-black font-extrabold px-5 py-2.5 rounded-xl text-sm transition active:scale-95"
          >
            {isSubmitting ? "..." : "Poster"}
          </button>
        </form>
      ) : (
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-4 rounded-2xl text-center">
          <p className="text-xs text-zinc-400 mb-3">Connecte-toi pour répondre et participer à la rigolade ! 🎉</p>
          <SignInButton mode="modal">
            <button className="bg-zinc-800 hover:bg-zinc-700 text-yellow-400 border border-yellow-400/20 font-bold px-4 py-2 rounded-xl text-xs transition">
              🔑 Se connecter
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
