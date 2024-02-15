// Single Board API methods//
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const images = [
  "placeholders/1.svg",
  "placeholders/2.svg",
  "placeholders/3.svg",
  "placeholders/4.svg",
  "placeholders/5.svg",
  "placeholders/6.svg",
  "placeholders/7.svg",
  "placeholders/8.svg",
  "placeholders/9.svg",
  "placeholders/10.svg",
];

// CREATE BOARD//
export const create = mutation({
  //arguements parsed in everytime a new board is created
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  //function to access the context and argument from above
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const randomImage = images[Math.floor(Math.random() * images.length)];
    // Create API route with CONVEX
    const board = await ctx.db.insert("boards", {
      title: args.title,
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });
    return board;
  },
});

// DELETE BOARD API MUTATION;
export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    // check delete favourites relation as well
    const userId = identity.subject;
    const existingFavourite = await ctx.db
      .query("userFavourites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();
    if (existingFavourite) {
      await ctx.db.delete(existingFavourite._id);
    }
    await ctx.db.delete(args.id);
  },
});

//UPDATE BOARD TITLE//

export const update = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();
    if (!title) {
      throw new Error("Title is required");
    }
    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });
    return board;
  },
});

// Favourtie
export const favourite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }
    const userId = identity.subject;

    //Check if the selection is already favourited
    const existingFavourite = await ctx.db
      .query("userFavourites")
      .withIndex("by_user_board_org", (q) =>
        q
          .eq("userId", userId) //matching ids
          .eq("boardId", board._id)
          .eq("orgId", args.orgId)
      )
      .unique();

    if (existingFavourite) {
      throw new Error("Board already favourited");
    }

    await ctx.db.insert("userFavourites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

//Unfavourite

export const unfavourite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }
    const userId = identity.subject;

    //Check if the selection is already favourited
    const existingFavourite = await ctx.db
      .query("userFavourites")
      .withIndex("by_user_board", (q) =>
        q
          .eq("userId", userId) //matching ids
          .eq("boardId", board._id)
      )
      .unique();

    if (!existingFavourite) {
      throw new Error("Favourited board not found");
    }

    await ctx.db.delete(existingFavourite._id);

    return board;
  },
});

// Simple get query
export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const board = ctx.db.get(args.id);

    return board;
  },
});
