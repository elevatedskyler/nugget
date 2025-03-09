"use client";

import { useState } from "react";
import { api, RouterOutputs } from "~/trpc/react";
import NuggetPreview from "./NuggetPreview";

export default function Nugget({
  onClick,
}: {
  onClick: (
    nugget: RouterOutputs["nugget"]["findSimilar"][number] | "create",
  ) => void;
}) {
  const [search, setSearch] = useState("");

  const { data: nuggets } = api.nugget.findSimilar.useQuery(
    {
      content: search,
      count: 8,
    },
    {
      enabled: search.length > 3,
    },
  );

  const getNuggetContent = (index: number) => {
    if (!nuggets) return null;
    return nuggets[index] ?? null;
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex w-full items-center justify-center gap-2">
        <input
          type="text"
          value={search}
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-none border-slate-300 p-2 text-lg outline-none"
        />
        <button
          onClick={() => onClick("create")}
          className="h-full border-2 border-slate-300 bg-sky-100 p-2 text-lg outline-none"
        >
          Create
        </button>
      </div>
      <div className="divide-y-dashed grid h-full w-full grid-cols-4 grid-rows-2 divide-x divide-y divide-slate-200 bg-black">
        <div>
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(0)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(2)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(2)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(2)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(3)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(4)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(5)} />}
        </div>
        <div className="">
          {<NuggetPreview onClick={onClick} nugget={getNuggetContent(6)} />}
        </div>
      </div>
    </div>
  );
}
