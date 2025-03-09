import type { Nugget } from "~/nugget";
import { RouterOutputs } from "~/trpc/react";

function NuggetPreview({
  nugget,
  setSelectedNugget,
}: {
  nugget?: RouterOutputs["nugget"]["findSimilar"][number] | "loading" | null;
  setSelectedNugget: (
    nugget: RouterOutputs["nugget"]["findSimilar"][number],
  ) => void;
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
      className={"h-full w-full bg-slate-50 p-4 hover:bg-white"}
      onClick={() => setSelectedNugget(nugget)}
    >
      {nugget.data}
    </div>
  );
}

export default NuggetPreview;
