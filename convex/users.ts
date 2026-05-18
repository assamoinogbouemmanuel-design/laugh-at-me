// convex/users.ts
import { mutation } from "./_generated/server";

export const syncUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Vérifier si l'utilisateur existe déjà
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email))
      .first();

    if (!user) {
      // Créer un nouvel utilisateur
      const newUserId = await ctx.db.insert("users", {
        name: identity.name ?? "Funny User",
        email: identity.email!,
        avatarUrl: identity.pictureUrl,
        username: identity.email!.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, ""),
        bio: "Je fais rire le monde 😂",
        totalLaughsReceived: 0,
        joinedAt: Date.now(),
      });

      user = await ctx.db.get(newUserId);
    }

    return user;
  },
});