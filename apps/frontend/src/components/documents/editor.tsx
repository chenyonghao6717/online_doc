import FontFamily from "@tiptap/extension-font-family";
import ImageResize from "tiptap-extension-resize-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
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
import { FontSizeExtension } from "@/components/extensions/font-size";
import { LineHeightExtension } from "@/components/extensions/line-height";
import { Ruler } from "./ruler";
import {
  defaultDocContentPadding,
  docPaperHeight,
  docPaperWidth,
} from "@/components/documents/constants";
import * as Y from "yjs";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useNavigate, useParams } from "react-router";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import { authClient } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import FullScreenSpinner from "@/components/spinners/full-screen-spinner";

const WS_URL: string = import.meta.env.VITE_WEB_SOCKET_URL;

export const Editor = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId: string }>();
  const { data: session } = authClient.useSession();
  const ydoc = useRef(new Y.Doc());
  const [initialized, setInitialized] = useState(false);
  const provider = useRef(
    new HocuspocusProvider({
      url: WS_URL,
      name: documentId!,
      document: ydoc.current,
      token: async () => {
        const { data: session } = await authClient.getSession();
        return session?.session.token ?? "";
      },
    }),
  );

  useEffect(() => {
    provider.current.on("authenticationFailed", () => {
      provider.current.disconnect();
      toast.error("You are not allowed to access this document.");
      navigate("/", { replace: true });
    });

    provider.current.on("authenticated", () => {
      setInitialized(true);
    });

    provider.current.on("stateless", ({ payload }: { payload: string }) => {
      const { event } = JSON.parse(payload) as { event: string };
      if (event === "DOCUMENT_SAVED") {
        toast.success("Document auto-saved!");
      }
    });

    return () => {
      provider.current.off("authenticationFailed");
      provider.current.off("authenticated");
      // provider.current.destroy();
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (provider.current.hasUnsyncedChanges) {
        event.preventDefault();
        alert("The document has been saved!");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [provider]);

  const { setEditor } = useEditorStore();
  const updateEditor = ({ editor }: { editor: TiptapEditor | null }) =>
    setEditor(editor);

  // for the global access of the editor instance from other componenets
  const editor = useEditor(
    {
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
        StarterKit.configure({
          undoRedo: false,
        }),
        Collaboration.configure({
          document: ydoc.current,
        }),
        CollaborationCaret.configure({
          provider: provider.current,
          user: {
            name: session?.user.name,
          },
          render: (user) => {
            const cursor = document.createElement("span");

            cursor.classList.add("collaboration-carets__caret");
            cursor.setAttribute("style", `border-color: ${user.color}`);

            const label = document.createElement("div");

            label.classList.add("collaboration-carets__label");
            label.setAttribute("style", `background-color: ${user.color}`);
            label.insertBefore(document.createTextNode(user.name), null);
            cursor.insertBefore(label, null);

            return cursor;
          },
        }),
      ],
    },
    [session],
  );

  if (!initialized) {
    return <FullScreenSpinner />;
  }

  return (
    <div className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible">
      <Ruler />
      <div className="min-w-max flex justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
