import { memo } from "react";
import { formatINR } from "../utils/format";

const getBidderDisplayName = (bid) =>
  bid.bidder_name || bid.username || bid.name || `User #${bid.bidder_id}`;

const BidHistoryList = memo(({ bids }) => {
  if (bids.length === 0) {
    return <p className="text-slate-500 text-sm">No bids yet. Be the first!</p>;
  }
  return (
    <ul className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
      {bids.map((bid) => (
        <li key={bid.id} className="flex items-center justify-between px-4 py-3 bg-white">
          <span className="text-sm text-slate-700">{getBidderDisplayName(bid)}</span>
          <span className="font-semibold text-slate-900">{formatINR(bid.amount)}</span>
          <span className="text-xs text-slate-400">
            {new Date(bid.created_at).toLocaleString()}
          </span>
        </li>
      ))}
    </ul>
  );
});

export default BidHistoryList;