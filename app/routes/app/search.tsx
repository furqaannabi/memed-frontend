import { useNavigate, useSearchParams } from "react-router";
import meme from "@/assets/images/meme.png";
import { MemeTokensSearchList } from "@/components/app/search/MemeTokensSearchList";
import { ChevronLeft } from "lucide-react";

// Mock data - in a real app, this would come from an API
const allMemeTokens = [
  {
    id: "1", // Changed to string to match component type
    name: "GLMP",
    creator: "Oxbruh",
    price: 21000,
    marketCap: "$21K",
    image: meme,
    progress: 75,
  },
  {
    id: "2",
    name: "PEPE",
    creator: "Matt Furie",
    price: 5100000000,
    marketCap: "$5.1B",
    image: meme,
    progress: 50,
  },
  {
    id: "3",
    name: "DOGE",
    creator: "Billy Markus",
    price: 20000000000,
    marketCap: "$20B",
    image: meme,
    progress: 90,
  },
  {
    id: "4",
    name: "WIF",
    creator: "memelord",
    price: 2500000000,
    marketCap: "$2.5B",
    image: meme,
    progress: 30,
  },
  {
    id: "5",
    name: "BONK",
    creator: "bonkdao",
    price: 1500000000,
    marketCap: "$1.5B",
    image: meme,
    progress: 60,
  },
  {
    id: "6",
    name: "SHIB",
    creator: "Ryoshi",
    price: 12000000000,
    marketCap: "$12B",
    image: meme,
    progress: 80,
  },
];

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const navigate = useNavigate();

  const filteredTokens = query
    ? allMemeTokens.filter((token) =>
        token.name.toLowerCase().includes(query.toLowerCase()),
      )
    : allMemeTokens;

  return (
    <div className="min-h-screen w-full">
      <div className="px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 cursor-pointer  "
        >
          {" "}
          <ChevronLeft size={14} />
          Back
        </button>
        <h1 className="text-sm font-semibold text-white">
          Search Results for "<span className="text-green-500">{query}</span>"
        </h1>

        {filteredTokens.length > 0 ? (
          <div className="flex-1 min-w-0 ">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 sm:gap-4 xl:gap-2  ">
              <div className="xl:col-span-4 py-4">
                <MemeTokensSearchList tokens={filteredTokens} />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">No memes found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
