"use client";

import { useSearchParam } from "@/hooks/use-search-param";
import DocumentsTable from "./documents-table";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";

const Home = () => {
  const [search] = useSearchParam();
  return (
    <div className="min-h-screen flex flex-col ">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <DocumentsTable search={search} />
      </div>
    </div>
  );
};

export default Home;
