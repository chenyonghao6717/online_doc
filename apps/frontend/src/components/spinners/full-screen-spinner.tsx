import { LoaderIcon } from "lucide-react";

const FullScreenSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50 fiexd top-0 left-0 backdrop-blur-sm">
      <LoaderIcon className="animate-spin size-7 text-muted-foreground" />
    </div>
  );
};

export default FullScreenSpinner;
