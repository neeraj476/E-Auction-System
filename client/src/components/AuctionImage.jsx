import { memo } from "react";

const AuctionImage = memo(({ imageUrl, title }) => (
  <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
    {imageUrl ? (
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
    ) : (
      <span className="text-slate-400">No image</span>
    )}
  </div>
));

export default AuctionImage;