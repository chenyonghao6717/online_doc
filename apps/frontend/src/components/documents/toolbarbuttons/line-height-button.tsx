import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/use-editor-store";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ListCollapseIcon } from "lucide-react";

const lineHeights = [
  {
    label: "Default",
    value: "normal",
  },
  {
    label: "Single",
    value: "1",
  },
  {
    label: "1.15",
    value: "1.15",
  },
  {
    label: "1.5",
    value: "1.5",
  },
  {
    label: "Double",
    value: "2",
  },
];

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5">
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => {
          return (
            <button
              key={value}
              onClick={() => editor?.chain().focus().setLineHeight(value).run()}
              className={cn(
                "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
                editor?.getAttributes("paragraph").lineHeight == value &&
                  "hover:bg-neutral-200/80"
              )}
            >
              <span className="text-sm">{label}</span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LineHeightButton;
