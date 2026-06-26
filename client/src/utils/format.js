export const formatINR = (value) => `₹${Number(value).toLocaleString("en-IN")}`;

export const calculateCountdownParts = (endTime) => {
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return { label: "Auction ended", isOver: true };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  let label;
  if (days > 0) label = `${days}d ${hours}h ${minutes}m`;
  else if (hours > 0) label = `${hours}h ${minutes}m ${seconds}s`;
  else label = `${minutes}m ${seconds}s`;

  return { label, isOver: false };
};

export const extractBids = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.bids)) return data.bids;
  return [];
};