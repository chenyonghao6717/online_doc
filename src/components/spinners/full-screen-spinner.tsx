import { Spinner } from "../ui/spinner";

const FullScreenSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Spinner className="size-10"/>
    </div>
  );
};

export default FullScreenSpinner;
