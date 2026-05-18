import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PostCard from "./PostCard.tsx";

export default function Feed() {
  const posts = useQuery(api.posts.getFeed) || [];

  return (
    <div className="space-y-8 pb-20">
      {posts.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          Aucune blague pour le moment...<br />Sois le premier à poster 😂
        </div>
      ) : (
        posts.map((post: any) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  );
}