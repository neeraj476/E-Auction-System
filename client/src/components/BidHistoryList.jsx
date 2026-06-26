import { memo } from "react";
import { formatINR } from "../utils/format";
import { useAuth } from "../context/AuthContext";

const getBidderName = (bid) =>
  bid.bidder_name || bid.username || bid.name || null;

const BidHistoryList = memo(({ bids = [] }) => {
  const { user } = useAuth();

  if (bids.length === 0) {
    return (
      <p className="text-slate-500 text-sm">
        No bids yet. Be the first!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
      {bids.map((bid) => {
        const name = getBidderName(bid);

        return (
          <li
            key={bid.id || bid._id}
            className="flex items-center justify-between px-4 py-3 bg-white"
          >
            <span className="text-sm text-slate-700">
              {name || user?.name || `User #${bid.bidder_id}`}
              {bid.bidder_id && (
                <span className="text-slate-400 font-normal">
                  {" "}
                  #{bid.bidder_id}
                </span>
              )}
            </span>

            <span className="font-semibold text-slate-900">
              {formatINR(bid.amount)}
            </span>

            <span className="text-xs text-slate-400">
              {new Date(bid.created_at).toLocaleString()}
            </span>
          </li>
        );
      })}
    </ul>
  );
});

export default BidHistoryList;