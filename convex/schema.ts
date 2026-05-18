import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    username: v.string(),
    bio: v.optional(v.string()),
    totalLaughsReceived: v.number(),
    joinedAt: v.number(),
  }).index("by_email", ["email"]),

  posts: defineTable({
    userId: v.id("users"),
    text: v.string(),
    mediaUrl: v.optional(v.string()),
    category: v.optional(v.string()),
    laughs: v.number(),
    createdAt: v.number(),
  })
    .index("by_creation", ["createdAt"])
    .index("by_laughs", ["laughs"]),
});