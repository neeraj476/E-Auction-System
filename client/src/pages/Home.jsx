import { useState, useMemo, useEffect } from "react";
import AuctionCard from "../components/AuctionCard";
import { getAllAuctions } from "../services/auctionApi";

const Home = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("ending-soon");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await getAllAuctions();
  console.log(data);


        // if API returns { auctions: [...] }
        setAuctions(data.auctions || data);
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = auctions.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );

    if (sortBy === "ending-soon") {
      result = [...result].sort(
        (a, b) => new Date(a.end_time) - new Date(b.end_time)
      );
    } else if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) => Number(a.current_price) - Number(b.current_price)
      );
    } else if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) => Number(b.current_price) - Number(a.current_price)
      );
    }

    return result;
  }, [auctions, search, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-10">
        Loading auctions...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Live Auctions
        </h1>

        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search auctions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="ending-soon">Ending Soon</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <p className="text-center py-12 text-slate-500">
          No auctions found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSorted.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;