import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ReactNode } from "react";

interface TriggerButtonProps {
  children?: ReactNode;
}

const TriggerButton = ({ children }: TriggerButtonProps) => {
  return (
    <DropdownMenuTrigger asChild>
      <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
        {children}
      </button>
    </DropdownMenuTrigger>
  );
};

export default TriggerButton;
