import { Link } from "react-router-dom";

const getTimeRemaining = (endTime) => {
  const diff = new Date(endTime) - new Date();

  if (diff <= 0) return "Ended";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  }

  return `${hours}h ${minutes}m left`;
};

const AuctionCard = ({ auction }) => {
  const isActive = auction.status === "active";
  const timeLabel = isActive
    ? getTimeRemaining(auction.end_time)
    : auction.status;

  return (
    <Link
      to={`/auctions/${auction.id}`}
      className="block bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow"
    >
      <div className="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
        {auction.image_url ? (
          <img
            src={auction.image_url}
            alt={auction.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-400 text-sm">No image</span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">
          {auction.title}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-xs text-slate-500">Current Bid</p>
            <p className="text-lg font-bold text-slate-900">
              ${Number(auction.current_price).toLocaleString()}
            </p>
          </div>

          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isActive
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {timeLabel}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default AuctionCard;
