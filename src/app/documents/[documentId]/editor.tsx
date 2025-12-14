"use client";

import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import {
  useEditor,
  EditorContent,
  Editor as TiptapEditor,
} from "@tiptap/react";
import { useEditorStore } from "@/store/use-editor-store";
import { FontSizeExtension } from "@/extensions/font-size";
import { LineHeightExtension } from "@/extensions/line-height";
import { Ruler } from "./ruler";
import {
  defaultDocContentPadding,
  docPaperHeight,
  docPaperWidth,
} from "./constants";

export const Editor = () => {
  const { setEditor } = useEditorStore();
  const updateEditor = ({ editor }: { editor: TiptapEditor | null }) =>
    setEditor(editor);

  // for the global access of the editor instance from other componenets
  const editor = useEditor({
    immediatelyRender: false,
    onCreate: updateEditor,
    onDestroy() {
      setEditor(null);
    },
    onUpdate: updateEditor,
    onSelectionUpdate: updateEditor,
    onTransaction: updateEditor,
    onFocus: updateEditor,
    onBlur: updateEditor,
    onContentError: updateEditor,
    editorProps: {
      attributes: {
        style: `padding-left: ${defaultDocContentPadding}px; padding-right: ${defaultDocContentPadding}px; min-height: ${docPaperHeight}px; min-width: ${docPaperWidth}px`,
        class: `focus:outline-none bg-white border print:border-0 border-[#C7C7C7] flex flex-col pt-10 pr-14 pd-10 cursor-text`,
      },
    },
    extensions: [
      Color,
      FontFamily,
      FontSizeExtension,
      Highlight.configure({ multicolor: true }),
      ImageResize,
      LineHeightExtension,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      StarterKit,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      TaskItem.configure({ nested: true }),
      TaskList,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Underline,
    ],
  });
  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
