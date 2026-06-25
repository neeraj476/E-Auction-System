import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyAuctions, cancelAuction } from "../services/auctionApi";

const statusStyles = {
  active: "bg-amber-100 text-amber-700",
  closed: "bg-green-100 text-green-700",
  cancelled: "bg-slate-100 text-slate-500",
};

const MyAuctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAuctions = async () => {
    try {
      const data = await getMyAuctions();
      setAuctions(data.auctions);
    } catch (err) {
      setError("Failed to load your auctions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const handleCancel = async (id) => {
    setCancellingId(id);
    try {
      const data = await cancelAuction(id);
      console.log(data);
      setAuctions((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel auction");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading)
    return (
      <p className="text-center py-12 text-slate-500">
        Loading your auctions...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Auctions</h1>
        <Link
          to="/create-auction"
          className="bg-amber-500 text-slate-900 font-semibold px-4 py-2 rounded-md hover:bg-amber-400 transition-colors text-sm"
        >
          + List New Item
        </Link>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {auctions.length === 0 ? (
        <p className="text-center py-12 text-slate-500">
          You haven't listed any auctions yet.
        </p>
      ) : (
        <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="flex items-center gap-4 p-4 bg-white"
            >
              <div className="w-16 h-16 rounded-md bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {auction.image_url ? (
                  <img
                    src={auction.image_url}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-slate-400 text-xs">No image</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/auctions/${auction.id}`}
                  className="font-semibold text-slate-900 hover:text-amber-600 truncate block"
                >
                  {auction.title}
                </Link>
                <p className="text-sm text-slate-500">
                  Current bid: ${Number(auction.current_price).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[auction.status]}`}
              >
                {auction.status}
              </span>

              {auction.status === "active" && (
                <button
                  onClick={() => handleCancel(auction.id)}
                  disabled={cancellingId === auction.id}
                  className="text-sm text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                >
                  {cancellingId === auction.id ? "Cancelling..." : "Cancel"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
