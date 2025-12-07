import Link from "next/link";
import Image from "next/image";
import { SearchInput } from "./search-input";

export const Navbar = () => {
  return (
    <nav className="flex items-center justify-between h-full w-full">
      <Link href="/">
        <div className="flex gap-3 items-center shrink-0 pr-6 ">
          <Image src="/logoipsum.svg" alt="Logo" width={36} height={36} />
          <h3 className="text-xl">Docs</h3>
        </div>
      </Link>
      <SearchInput />
      <div />
    </nav>
  );
};
