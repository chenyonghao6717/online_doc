import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "@/store/use-editor-store";
import { Link2Icon } from "lucide-react";
import { useState } from "react";

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [href, setHref] = useState("");

  const onButtonClick = (href: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href }).run();
    setHref("");
  };

  const onOpenDropdownMenu = (open: boolean | null) => {
    if (open) {
      setHref(editor?.getAttributes("link").href || "");
    }
  };

  return (
    <DropdownMenu onOpenChange={onOpenDropdownMenu}>
      <DropdownMenuTrigger asChild>
        <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="https://example.com"
          value={href}
          onChange={(e) => setHref(e.target.value)}
        />
        <Button onClick={() => onButtonClick(href)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LinkButton;
