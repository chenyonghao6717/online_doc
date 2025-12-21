import { LoaderIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

const FullScreenSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <LoaderIcon className="animate-spin size-7 text-muted-foreground" />
    </div>
  );
};

export default FullScreenSpinner;
