import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-5 -translate-y-1/2 text-gray-400"
        size={16}
      />
      <input
        type="text"
        placeholder="Search"
        className="w-full bg-[#231528] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
      />
    </div>
  );
};

export default SearchBar;
