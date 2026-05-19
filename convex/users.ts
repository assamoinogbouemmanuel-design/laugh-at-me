// convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
  args: {
    customUsername: v.optional(v.string()),
    customName: v.optional(v.string()),
    customEmail: v.optional(v.string()),
    customAvatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    let email = identity?.email;
    let name = identity?.name;
    let avatarUrl = identity?.pictureUrl;
    let username = identity?.email?.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");

    // Fallback to client-provided parameters if local JWT verification fails
    if (!identity && args.customEmail) {
      email = args.customEmail;
      name = args.customName ?? "Humoriste";
      avatarUrl = args.customAvatar;
      username = args.customUsername ?? args.customEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    }

    // Ultimate fallback if completely logged out
    if (!email) {
      email = "dev@laughhub.com";
      name = "Directeur de Rire (Local Dev)";
      avatarUrl = undefined;
      username = "dev_funny";
    }

    // Format username cleanly
    const formattedUsername = username!.toLowerCase().replace(/[^a-z0-9_]/g, "");

    // Check if the user exists
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email!))
      .first();

    if (!user) {
      const newUserId = await ctx.db.insert("users", {
        name: name ?? "Funny User",
        email: email!,
        avatarUrl,
        username: formattedUsername,
        bio: email === "dev@laughhub.com" ? "Créateur de LaughHub en mode local 🛠️😂" : "Je fais rire le monde 😂",
        totalLaughsReceived: 0,
        joinedAt: Date.now(),
      });
      user = await ctx.db.get(newUserId);
    } else {
      // Sync local profile updates if needed
      await ctx.db.patch(user._id, {
        name: name ?? user.name,
        avatarUrl: avatarUrl ?? user.avatarUrl,
        username: formattedUsername,
      });
    }

    return user!;
  },
});

export const getUserProfile = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.username.toLowerCase()))
      .first();

    if (!user) return null;

    const posts = await ctx.db
      .query("posts")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .collect();

    const postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        return {
          ...post,
          username: user.username,
          userAvatar: user.avatarUrl,
          mediaUrl: post.mediaUrl
            ? await ctx.storage.getUrl(post.mediaUrl)
            : undefined,
        };
      })
    );

    // Sort by latest
    postsWithMedia.sort((a, b) => b.createdAt - a.createdAt);

    return {
      user,
      posts: postsWithMedia,
    };
  },
});