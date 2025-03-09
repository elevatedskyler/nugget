"use client";

import { api, RouterOutputs } from "~/trpc/react";
import { Editor } from "./TextEditor";
import { useState, useEffect } from "react";
import NuggetPreview from "./NuggetPreview";

function EditorContainer({
  nugget,
  onClose,
}: {
  nugget: RouterOutputs["nugget"]["findSimilar"][number] | "create";
  onClose: () => void;
}) {
  const [content, setContent] = useState(
    nugget === "create" ? "" : (nugget.data ?? ""),
  );

  const [similarQuery, setSimilarQuery] = useState(content);

  const [nuggetId, setNuggetId] = useState<string | null>(
    nugget === "create" ? null : String(nugget.id),
  );

  const utils = api.useUtils();

  useEffect(() => {
    return () => {
      void utils.nugget.findSimilar.invalidate();
    };
  }, [utils.nugget.findSimilar]);

  const { data: similarNuggets, refetch: refetchSimilar } =
    api.nugget.findSimilar.useQuery(
      {
        content: similarQuery,
        count: 6,
        exclude: nuggetId ?? undefined,
      },
      {
        enabled: content.length > 3,
      },
    );

  const { mutate: createNugget } = api.nugget.create.useMutation({
    onSuccess: (data) => {
      setNuggetId(data);
    },
  });
  const { mutate: updateNugget } = api.nugget.update.useMutation();

  const { mutate: mergeNuggets } = api.nugget.merge.useMutation({
    onSuccess: async (data) => {
      setContent(data);
      void refetchSimilar();
    },
  });

  const handleSave = () => {
    if (nuggetId && typeof nuggetId === "string") {
      updateNugget({ id: nuggetId, content: content });
    } else {
      const id = createNugget({ content: content });
    }

    setSimilarQuery(content);
  };

  const handleMerge = (
    donorNugget: RouterOutputs["nugget"]["findSimilar"][number] | undefined,
  ) => {
    if (donorNugget && typeof donorNugget.id === "string" && nuggetId) {
      const result = mergeNuggets({
        sourceId: nuggetId,
        donorId: donorNugget.id,
      });
    }
  };

  return (
    <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-4">
      <div className="col-start-1 row-start-1">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[0])}
          nugget={similarNuggets?.[0]}
        />
      </div>
      <div className="col-start-1 row-start-2">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[1])}
          nugget={similarNuggets?.[1]}
        />
      </div>
      <div className="col-start-1 row-start-3">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[2])}
          nugget={similarNuggets?.[2]}
        />
      </div>
      <div className="col-start-4 row-start-1">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[3])}
          nugget={similarNuggets?.[3]}
        />
      </div>
      <div className="col-start-4 row-start-2">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[4])}
          nugget={similarNuggets?.[4]}
        />
      </div>
      <div className="col-start-4 row-start-3">
        <NuggetPreview
          isMergable={true}
          onClick={() => handleMerge(similarNuggets?.[5])}
          nugget={similarNuggets?.[5]}
        />
      </div>
      <div className="col-span-2 col-start-2 row-span-3 row-start-1">
        <Editor
          value={content}
          setValue={setContent}
          onSave={handleSave}
          onClose={onClose}
          className="h-full w-full"
        />
      </div>
    </div>
  );
}

export default EditorContainer;
