import { z } from "zod";

const nuggetSchema = z.object({
  id: z.string(),
  content: z.string(),
});

export type Nugget = z.infer<typeof nuggetSchema>;

const nuggetMetadataSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
  tags: z.array(z.string()),
});

export type NuggetMetadata = z.infer<typeof nuggetMetadataSchema>;
