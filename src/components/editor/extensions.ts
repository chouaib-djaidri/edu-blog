import {
  AIHighlight,
  CharacterCount,
  Color,
  CustomKeymap,
  GlobalDragHandle,
  HighlightExtension,
  HorizontalRule,
  Placeholder,
  StarterKit,
  TextStyle,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  UpdatedImage,
  UploadImagesPlugin,
} from "novel";

import { cx } from "class-variance-authority";

const aiHighlight = AIHighlight;
const placeholder = Placeholder;
const tiptapLink = TiptapLink.configure({
  HTMLAttributes: {
    class: cx(
      "text-muted-foreground underline underline-offset-[3px] hover:text-primary transition-colors cursor-pointer"
    ),
  },
});

const tiptapImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [
      UploadImagesPlugin({
        imageClass: cx("opacity-40 rounded-xl border border-stone-200 "),
      }),
    ];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: cx("rounded-xl border border-muted ProseMirror-selectednode"),
  },
});

const updatedImage = UpdatedImage.configure({
  HTMLAttributes: {
    class: cx("rounded-xl border border-muted"),
  },
});

const horizontalRule = HorizontalRule.configure({
  HTMLAttributes: {
    class: cx("mt-4 mb-6 border-t border-muted-foreground"),
  },
});

const starterKit = StarterKit.configure({
  heading: {
    HTMLAttributes: {
      class: cx("ProseMirror font-semibold"),
    },
  },
  bulletList: {
    HTMLAttributes: {
      class: cx("list-disc pl-5"),
    },
  },
  orderedList: {
    HTMLAttributes: {
      class: cx("list-decimal pl-5"),
    },
  },
  listItem: {
    HTMLAttributes: {
      class: cx("list"),
    },
  },
  blockquote: {
    HTMLAttributes: {
      class: cx("border-l-[3px] border-foreground pl-2.5 py-1 italic"),
    },
  },
  horizontalRule: false,
});

const characterCount = CharacterCount.configure();

export const defaultExtensions = [
  starterKit,
  placeholder,
  tiptapLink,
  tiptapImage,
  updatedImage,
  horizontalRule,
  aiHighlight,
  characterCount,
  TiptapUnderline,
  HighlightExtension,
  TextStyle,
  Color,
  CustomKeymap,
  GlobalDragHandle,
];
