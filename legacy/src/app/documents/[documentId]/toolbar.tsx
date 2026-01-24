"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BoldIcon,
  ItalicIcon,
  ListTodoIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  SpellCheckIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react";
import { useEditorStore } from "@/store/use-editor-store";
import FontFamilyButton from "./toolbarbuttons/font-family-button";
import HeadingLevelButton from "./toolbarbuttons/heading-level-button";
import TextColorButton from "./toolbarbuttons/text-color-button";
import HighlightColorButton from "./toolbarbuttons/highlight-color-button";
import LinkButton from "./toolbarbuttons/link-button";
import ImageButton from "./toolbarbuttons/image-button";
import AlignButton from "./toolbarbuttons/align-button";
import ListButton from "./toolbarbuttons/list-button";
import FontSizeButton from "./toolbarbuttons/font-size-button";
import LineHeightButton from "./toolbarbuttons/line-height-button";

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
}: ToolbarButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
        isActive && "bg-neutral-200/80"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};

export const Toolbar = () => {
  const { editor } = useEditorStore();

  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => {
          editor?.chain().focus().undo().run();
        },
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => {
          editor?.chain().focus().redo().run();
        },
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => {
          window.print();
        },
      },
      {
        label: "Spell Check",
        icon: SpellCheckIcon,
        onClick: () => {
          const spellCheckAttr = "spellcheck";
          const current = editor?.view.dom.getAttribute(spellCheckAttr);
          editor?.view.dom.setAttribute(
            spellCheckAttr,
            current === "false" ? "true" : "false"
          );
          console.log("spell opened? ", current);
        },
      },
    ],
    [
      {
        label: "Bold",
        icon: BoldIcon,
        isActive: editor?.isActive("bold"),
        onClick: () => {
          editor?.chain().focus().toggleBold().run();
        },
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        isActive: editor?.isActive("italic"),
        onClick: () => {
          editor?.chain().focus().toggleItalic().run();
        },
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        isActive: editor?.isActive("underline"),
        onClick: () => {
          editor?.chain().focus().toggleUnderline().run();
        },
      },
    ],
    [
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        isActive: false,
        onClick: () => {
          console.log("Comment");
        },
      },
      {
        label: "List Todo",
        icon: ListTodoIcon,
        isActive: editor?.isActive("taskList"),
        onClick: () => {
          editor?.chain().focus().toggleTaskList().run();
        },
      },
      {
        label: "Remove Formatting",
        icon: RemoveFormattingIcon,
        onClick: () => {
          editor?.chain().focus().unsetAllMarks().run();
        },
      },
    ],
  ];
  return (
    <div className="bg-[#F1F4F9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}
      <Separator orientation="vertical" className="h-6 bg-neutral-300 " />

      <FontFamilyButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300 " />

      <HeadingLevelButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300 " />

      <FontSizeButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300 " />

      {sections[1].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}

      <TextColorButton />
      <HighlightColorButton />
      <Separator orientation="vertical" className="h-6 bg-neutral-300 " />

      <LinkButton />
      <ImageButton />
      <AlignButton />
      <LineHeightButton />
      <ListButton />

      {sections[2].map((button) => (
        <ToolbarButton key={button.label} {...button} />
      ))}
    </div>
  );
};
