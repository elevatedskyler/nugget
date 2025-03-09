"use client";

import type { Nugget } from "~/nugget";
import { RouterOutputs } from "~/trpc/react";

function NuggetPreview({
  nugget,
  onClick,
  isMergable,
}: {
  nugget?: RouterOutputs["nugget"]["findSimilar"][number] | "loading" | null;
  onClick: (nugget: RouterOutputs["nugget"]["findSimilar"][number]) => void;
  isMergable?: boolean;
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
        "group relative h-full w-full bg-slate-50 p-4 hover:cursor-pointer hover:bg-white"
      }
      onClick={() => onClick(nugget)}
    >
      {nugget.data}
      {isMergable && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-xl font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
          MERGE
        </div>
      )}
    </div>
  );
}

export default NuggetPreview;
