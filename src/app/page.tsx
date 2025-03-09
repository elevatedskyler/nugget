import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import GridLayout from "~/app/_components/GridLayout";
import { api, HydrateClient } from "~/trpc/server";
import TestGrid from "./_components/TestGrid";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex h-screen w-screen bg-black text-slate-900">
        <GridLayout />
      </main>
    </HydrateClient>
  );
}
