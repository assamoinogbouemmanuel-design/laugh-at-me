import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getFeed = query({
  args: {
    category: v.optional(v.string()),
    sortBy: v.optional(v.string()), // "latest" | "trending"
  },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("posts").order("desc").collect();
    
    // Sort by laughs if trending is selected
    if (args.sortBy === "trending") {
      posts.sort((a, b) => (b.laughs || 0) - (a.laughs || 0));
    }

    // Filter by category if specified (and not 'All' or 'General')
    if (args.category && args.category !== "All" && args.category !== "Tous") {
      posts = posts.filter(post => post.category?.toLowerCase() === args.category?.toLowerCase());
    }

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

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (!user) throw new Error("Profil utilisateur introuvable");

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
    if (!post) throw new Error("Post not found");

    await ctx.db.patch(args.postId, {
      laughs: (post.laughs || 0) + 1,
    });

    const user = await ctx.db.get(post.userId);
    if (user) {
      await ctx.db.patch(post.userId, {
        totalLaughsReceived: (user.totalLaughsReceived || 0) + 1,
      });
    }
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => ctx.storage.generateUploadUrl(),
});
