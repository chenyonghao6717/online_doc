import { LoaderIcon } from "lucide-react";
import { useAppStore } from "@/components/stores/app-store";

const FullScreenSpinner = () => {
  const { loadingCount } = useAppStore();

  return (
    loadingCount > 0 && (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <LoaderIcon className="animate-spin size-7 text-muted-foreground" />
      </div>
    )
  );
};

export default FullScreenSpinner;
