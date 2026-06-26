import { useState, memo } from "react";

const BidForm = ({ currentPrice, minIncrement = 1, onSubmit, disabled }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const minBid = Number(currentPrice) + minIncrement;

  const handleSubmit = (e) => {
    e.preventDefault();
    const bidAmount = Number(amount);

    if (!bidAmount || bidAmount < minBid) {
      setError(`Bid must be at least ₹${minBid.toLocaleString("en-IN")}`);
      return;
    }

    setError("");
    onSubmit(bidAmount);
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-700">
        Your Bid (minimum ₹{minBid.toLocaleString("en-IN")})
      </label>
      <div className="flex gap-2">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`₹${minBid.toLocaleString("en-IN")}`}
          disabled={disabled}
          className="flex-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-slate-100"
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-amber-500 text-slate-900 font-semibold px-5 py-2 rounded-md hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {disabled ? "Placing..." : "Place Bid"}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
};

export default memo(BidForm);
