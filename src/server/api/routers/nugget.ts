import { z } from "zod";
import { NuggetMetadata } from "~/nugget";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
interface nugget {
  id: number;
  name: string;
}

export const nuggetRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const id = crypto.randomUUID();
      const response = await ctx.nuggets.upsert({
        id: id,
        data: input.content,
        metadata: {
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: [],
        },
      });
      if (response !== "Success") {
        throw new Error("Failed to create nugget");
      }
      return id;
    }),
  update: publicProcedure
    .input(z.object({ id: z.string(), content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.nuggets.upsert({
        id: input.id,
        data: input.content,
      });
      if (response !== "Success") {
        throw new Error("Failed to update nugget");
      }
      return true;
    }),
  findSimilar: publicProcedure
    .input(z.object({ content: z.string(), count: z.number().min(1) }))
    .query(async ({ input, ctx }) => {
      const nugget = await ctx.nuggets.query({
        topK: input.count,
        data: input.content,
        includeData: true,
      });
      return nugget;
    }),
});
