import { Editor } from "@/components/documents/editor";
import { Navbar } from "@/components/documents/navbar";
import { Toolbar } from "@/components/documents/toolbar";

const DocumentIdPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#FAFBFD] print:hidden ">
        <Navbar />
        <Toolbar />
      </div>
      <div className="mt-[114px] print:pt-0">
        <Editor />
      </div>
    </div>
  );
};

export default DocumentIdPage;
