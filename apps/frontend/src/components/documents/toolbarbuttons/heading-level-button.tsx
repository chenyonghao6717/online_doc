import { type Editor } from "@tiptap/react";
import { useEditorStore } from "@/store/use-editor-store";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { type Level } from "@tiptap/extension-heading";
import TriggerButton from "./trigger-button";
import { ChevronDownIcon } from "lucide-react";

const headings = [
  { label: "Normal text", value: 0, fontSize: "16px" },
  { label: "Heading 1", value: 1, fontSize: "32px" },
  { label: "Heading 2", value: 2, fontSize: "24px" },
  { label: "Heading 3", value: 3, fontSize: "20px" },
  { label: "Heading 4", value: 4, fontSize: "18px" },
  { label: "Heading 5", value: 5, fontSize: "16px" },
];

const getCurrentHeading = (editor: Editor | null): string => {
  for (let level = 1; level <= 5; level++) {
    if (editor?.isActive("heading", { level })) {
      return `Heading ${level}`;
    }
  }
  return "Normal text";
};

const styleDropdownItem = (editor: Editor | null, value: number) => {
  return (
    (value === 0 && !editor?.isActive("heading")) ||
    (editor?.isActive("heading", { level: value }) && "bg-neutral-200/80")
  );
};

const setHeading = (editor: Editor | null, level: number) => {
  return () => {
    if (level === 0) {
      editor?.chain().focus().setParagraph().run();
    } else {
      editor
        ?.chain()
        .focus()
        .toggleHeading({ level: level as Level })
        .run();
    }
  };
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();
  return (
    <DropdownMenu>
      <TriggerButton>
        <span className="truncate">{getCurrentHeading(editor)}</span>
        <ChevronDownIcon className="ml-2 size-4 shrink-0" />
      </TriggerButton>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <button
            onClick={setHeading(editor, value)}
            key={value}
            style={{ fontSize }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              styleDropdownItem(editor, value)
            )}
          >
            {label}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeadingLevelButton;
