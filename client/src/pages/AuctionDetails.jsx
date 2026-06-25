import { useState, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import BidForm from "../components/BidForm";
import AuctionImage from "../components/AuctionImage";
import BidHistoryList from "../components/BidHistoryList";
import { useAuth } from "../context/AuthContext";
import { useAuctionDetails } from "../hooks/useAuctionDetails";
import { useCountdown } from "../hooks/useCountdown";
import { placeBid } from "../services/auctionApi";
import { formatINR } from "../utils/format";

const AuctionDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { auction, bids, loading, error, refetch } = useAuctionDetails(id);
  const { label: countdownLabel } = useCountdown(auction?.end_time);

  const [message, setMessage] = useState(null);
  const [bidError, setBidError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleBidSubmit = useCallback(
    async (amount) => {
      setBidError(null);
      setMessage(null);
      setSubmitting(true);
      try {
        await placeBid(id, amount);
        setMessage(`Bid of ${formatINR(amount)} placed successfully!`);
        await refetch();
      } catch (err) {
        console.error(err);
        setBidError(err.response?.data?.message || "Failed to place bid");
      } finally {
        setSubmitting(false);
      }
    },
    [id, refetch],
  );

  const isActive = useMemo(() => auction?.status === "active", [auction?.status]);
  const isSeller = useMemo(
    () => Boolean(user) && user.id === auction?.seller_id,
    [user, auction?.seller_id],
  );
  const currentPrice = useMemo(
    () => auction?.current_price ?? auction?.starting_price,
    [auction?.current_price, auction?.starting_price],
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-slate-500 text-sm">Loading auction...</p>
      </div>
    );
  }

  if (error || !auction) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p className="text-red-600 text-sm mb-3">{error || "Auction not found."}</p>
        <button onClick={refetch} className="text-sm font-medium text-amber-600 hover:text-amber-500">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AuctionImage imageUrl={auction.image_url} title={auction.title} />

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{auction.title}</h1>
            <p className="text-slate-600 mt-2">{auction.description}</p>
          </div>

          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-4">
            <div>
              <p className="text-xs text-slate-500">Current Bid</p>
              <p className="text-2xl font-bold text-slate-900">{formatINR(currentPrice)}</p>
            </div>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${
                isActive ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
              }`}
            >
              {isActive ? countdownLabel : auction.status}
            </span>
          </div>

          {!isActive ? (
            <p className="text-slate-500 text-sm">This auction is no longer accepting bids.</p>
          ) : !user ? (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <p className="text-slate-600 text-sm mb-3">Log in to place a bid on this item.</p>
              <Link
                to="/login"
                className="inline-block bg-amber-500 text-slate-900 font-semibold px-5 py-2 rounded-md hover:bg-amber-400 transition-colors"
              >
                Log In to Bid
              </Link>
            </div>
          ) : isSeller ? (
            <p className="text-slate-500 text-sm">You can't bid on your own auction.</p>
          ) : (
            <BidForm currentPrice={currentPrice} minIncrement={1} onSubmit={handleBidSubmit} disabled={submitting} />
          )}

          {bidError && <p className="text-sm text-red-500">{bidError}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Bid History</h2>
        <BidHistoryList bids={bids} />
      </div>
    </div>
  );
};

export default AuctionDetails;