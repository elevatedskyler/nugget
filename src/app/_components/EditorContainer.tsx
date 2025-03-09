"use client";

import { api, RouterOutputs } from "~/trpc/react";
import { Editor } from "./TextEditor";
import { useState } from "react";

function EditorContainer({
  nugget,
  onClose,
}: {
  nugget: RouterOutputs["nugget"]["findSimilar"][number] | "create";
  onClose: () => void;
}) {
  const [content, setContent] = useState(
    nugget === "create" ? "" : nugget.data,
  );

  const [nuggetId, setNuggetId] = useState<string | null>(
    nugget === "create" ? null : String(nugget.id),
  );

  const { mutate: createNugget } = api.nugget.create.useMutation({
    onSuccess: (data) => {
      setNuggetId(data);
    },
  });
  const { mutate: updateNugget } = api.nugget.update.useMutation();

  const handleSave = (content: string) => {
    if (nuggetId && typeof nuggetId === "string") {
      updateNugget({ id: nuggetId, content: content });
    } else {
      const id = createNugget({ content: content });
    }
  };

  return (
    <Editor
      initialContent={nugget === "create" ? "" : nugget.data}
      onSave={handleSave}
      onClose={onClose}
      className="h-full w-full"
    />
  );
}

export default EditorContainer;
