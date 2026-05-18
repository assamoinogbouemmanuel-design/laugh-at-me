import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getFeed = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return Promise.all(
      posts.map(async (post) => {
        const user = await ctx.db.get(post.userId);
        return {
          ...post,
          username: user?.username ?? "anonymous",
          userAvatar: user?.avatarUrl,
          mediaUrl: post.mediaUrl
            ? await ctx.storage.getUrl(post.mediaUrl)
            : undefined,
        };
      })
    );
  },
});

export const createPost = mutation({
  args: {
    text: v.string(),
    mediaUrl: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.insert("posts", {
      userId: user._id,
      text: args.text,
      mediaUrl: args.mediaUrl,
      category: args.category,
      laughs: 0,
      createdAt: Date.now(),
    });
  },
});

export const addLaugh = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (post) {
      await ctx.db.patch(args.postId, { laughs: post.laughs + 1 });
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});