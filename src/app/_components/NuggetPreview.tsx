"use client";

import type { Nugget } from "~/nugget";
import { RouterOutputs } from "~/trpc/react";

function NuggetPreview({
  nugget,
  onClick,
}: {
  nugget?: RouterOutputs["nugget"]["findSimilar"][number] | "loading" | null;
  onClick: (nugget: RouterOutputs["nugget"]["findSimilar"][number]) => void;
}) {
  if (nugget === "loading") {
    return (
      <div className="h-full w-full bg-slate-50 p-4 hover:bg-white">
        <div className="h-full w-full">Loading...</div>
      </div>
    );
  }

  if (!nugget) {
    return <div className="h-full w-full bg-gray-500 p-4"></div>;
  }

  return (
    <div
      className={
        "h-full w-full bg-slate-50 p-4 hover:cursor-pointer hover:bg-white"
      }
      onClick={() => onClick(nugget)}
    >
      {nugget.data}
    </div>
  );
}

export default NuggetPreview;
