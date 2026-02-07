import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { ListIcon, ListOrderedIcon } from "lucide-react";
import { type Editor } from "@tiptap/react";

const lists = [
  {
    label: "Bullet List",
    icon: ListIcon,
    isActive: (editor: Editor | null) => editor?.isActive("bulletList"),
    onClick: (editor: Editor | null) =>
      editor?.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Ordered List",
    icon: ListOrderedIcon,
    isActive: (editor: Editor | null) => editor?.isActive("orderedList"),
    onClick: (editor: Editor | null) =>
      editor?.chain().focus().toggleOrderedList().run(),
  },
];

const ListButton = () => {
  const { editor } = useEditorStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={() => onClick(editor)}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              isActive(editor) && "bg-neutral-200/80"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ListButton;
