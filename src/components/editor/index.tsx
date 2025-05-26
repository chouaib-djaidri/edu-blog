"use client";
// import { Separator } from "@/components/ui/separator";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  GlobalDragHandle,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
} from "novel";
// import { useState } from "react";
import { defaultExtensions } from "./extensions";
// import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
// import { ColorSelector } from "./selectors/color-selector";
// import { LinkSelector } from "./selectors/link-selector";
// import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";
import { useDebouncedCallback } from "use-debounce";
import "@/styles/editor.css";

export const defaultEditorContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const extensions = [
  ...defaultExtensions,
  slashCommand,
  GlobalDragHandle.configure({
    dragHandleWidth: 20,
    scrollTreshold: 100,
  }),
];

const Editor = ({
  content,
  setContent,
}: {
  content: JSONContent;
  setContent: (content: JSONContent) => void;
}) => {
  // const [openColor, setOpenColor] = useState(false);
  // const [openLink, setOpenLink] = useState(false);
  // const [openAI, setOpenAI] = useState(false);

  const debouncedUpdates = useDebouncedCallback(
    async (editor: EditorInstance) => {
      const json = editor.getJSON();
      setContent(json);
    },
    0
  );

  return (
    <div className="relative w-full flex flex-col flex-1">
      <EditorRoot>
        <EditorContent
          initialContent={content}
          extensions={extensions}
          className="relative min-h-[300px] flex-1 w-full"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) =>
              handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) =>
              handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full space-y-2",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
          }}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">
              No results
            </EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
          {/* <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <div>
              <Separator orientation="vertical" />
            </div>
            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <div>
              <Separator orientation="vertical" />
            </div>
            <TextButtons />
            <div>
              <Separator orientation="vertical" />
            </div>
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch> */}
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default Editor;
