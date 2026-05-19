import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all comments for a post in real-time, complete with user info
 */
export const getComments = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .collect();

    return Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          username: user?.username ?? "anonymous",
          userAvatar: user?.avatarUrl,
        };
      })
    );
  },
});

/**
 * Add a comment to a post
 */
export const addComment = mutation({
  args: {
    postId: v.id("posts"),
    text: v.string(),
    customEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    let email = identity?.email;

    if (!identity && args.customEmail) {
      email = args.customEmail;
    }

    if (!email) {
      email = "dev@laughhub.com";
    }

    // Sync the user if they don't exist yet
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("Profil utilisateur introuvable");

    await ctx.db.insert("comments", {
      postId: args.postId,
      userId: user._id,
      text: args.text.trim(),
      createdAt: Date.now(),
    });
  },
});
