import LaughButton from "./LaughButton.tsx";

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

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 hover:border-yellow-400/50 transition">
      <div className="flex items-center gap-3 mb-4">
        {post.userAvatar ? (
          <img src={post.userAvatar} className="w-10 h-10 rounded-2xl object-cover" alt={post.username} />
        ) : (
          <div className="w-10 h-10 bg-yellow-400 rounded-2xl flex items-center justify-center text-2xl">
            😂
          </div>
        )}
        <div>
          <p className="font-semibold">@{post.username}</p>
          <p className="text-xs text-zinc-500">
            {new Date(post.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        {post.category && (
          <span className="ml-auto px-4 py-1 bg-zinc-800 text-xs rounded-full">
            {post.category}
          </span>
        )}
      </div>

      <p className="text-lg leading-relaxed mb-5">{post.text}</p>
      
      {post.mediaUrl && (
        <img 
          src={post.mediaUrl} 
          className="rounded-2xl w-full mb-6" 
          alt="meme" 
        />
      )}

      <LaughButton postId={post._id} initialLaughs={post.laughs} />
    </div>
  );
}