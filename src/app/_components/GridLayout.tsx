"use client";

import { useContext, useState } from "react";
import EditorContainer from "./EditorContainer";
import { useNugget, withNuggetContext } from "~/contexts/NuggetContext";
import NuggetPreview from "./NuggetPreview";
import { Nugget } from "~/nugget";
import { RouterOutputs } from "~/trpc/react";
import NuggetHome from "./NuggetHome";

export const GridLayout = () => {
  const [selectedNugget, setSelectedNugget] = useState<
    RouterOutputs["nugget"]["findSimilar"][number] | "create" | null
  >(null);

  console.log(selectedNugget);
  if (!selectedNugget) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-900">
        <NuggetHome setSelectedNugget={setSelectedNugget} />
      </div>
    );
  }

  return (
    <EditorContainer
      onClose={() => setSelectedNugget(null)}
      nugget={selectedNugget}
    />
  );
};

// Export the wrapped component as default
export default withNuggetContext(GridLayout);
