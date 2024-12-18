import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ handleShowSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <div className="max-w-[1024px] mx-auto mt-8 flex justify-between items-center relative">
      <form onSubmit={handleSubmit} className="w-full">
        <input
          className="w-full border-2 p-2"
          placeholder="Search  Products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <AiFillCloseCircle
        size="24px"
        className="absolute right-0 mr-4 cursor-pointer"
        onClick={
          searchQuery.length > 0 ? () => setSearchQuery("") : handleShowSearch
        }
      />
    </div>
  );
}
