import OpenAI from "openai";
import { z } from "zod";
import { NuggetMetadata } from "~/nugget";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Mocked DB
interface nugget {
  id: number;
  name: string;
}

async function mergeNuggets(nugget1: string, nugget2: string) {
  const model = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await model.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a text merging tool. Your only task is to merge text_1 and text_2 where there is overlap. If merging is not possible for any reason do not explain, apologize, or add any additional commentary. Never add new content beyond what exists in the original texts.",
      },
      {
        role: "user",
        content: `text_1: ${nugget1}\n\ntext_2: ${nugget2}`,
      },
    ],
  });

  const responseChoices = response.choices;

  if (!responseChoices) {
    throw new Error("No response from OpenAI");
  }

  const responseChoice = responseChoices[0];

  if (!responseChoice) {
    throw new Error("No response from OpenAI");
  }

  const message = responseChoice.message.content;

  if (!message) {
    throw new Error("No message from OpenAI");
  }

  return message;
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
    .input(
      z.object({
        content: z.string(),
        count: z.number().min(1),
        exclude: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const nuggets = await ctx.nuggets.query({
        topK: input.exclude ? input.count + 1 : input.count,
        data: input.content,
        includeData: true,
      });
      if (input.exclude) {
        return nuggets.filter((nugget) => nugget.id !== input.exclude);
      }
      return nuggets;
    }),
  merge: publicProcedure
    .input(z.object({ sourceId: z.string(), donorId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const donorNuggetResult = await ctx.nuggets.fetch(
        {
          ids: [input.donorId],
        },
        {
          includeData: true,
        },
      );
      const donorNugget = donorNuggetResult[0];

      if (!donorNugget) {
        throw new Error("Donor nugget not found");
      }

      if (!donorNugget.data) {
        throw new Error("Donor nugget data not found");
      }

      const sourceNuggetResult = await ctx.nuggets.fetch(
        {
          ids: [input.sourceId],
        },
        {
          includeData: true,
        },
      );
      const sourceNugget = sourceNuggetResult[0];

      if (!sourceNugget) {
        throw new Error("Source nugget not found");
      }
      if (!sourceNugget.data) {
        throw new Error("Source nugget data not found");
      }

      const mergeResult = await mergeNuggets(
        sourceNugget.data,
        donorNugget.data,
      );

      await ctx.nuggets.delete({
        ids: [input.donorId],
      });

      const mergedNugget = await ctx.nuggets.upsert({
        id: sourceNugget.id,
        data: mergeResult,
      });

      return mergeResult;
    }),
});
