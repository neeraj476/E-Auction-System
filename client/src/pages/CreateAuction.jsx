import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../services/auctionApi";

const CreateAuction = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Build a local preview URL whenever a new image is picked, and clean up
  // the old one so we don't leak memory across re-renders/unmounts.
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !startingPrice || !endTime) {
      setError("Title, starting price, and end time are required");
      return;
    }

    if (Number(startingPrice) <= 0) {
      setError("Starting price must be greater than 0");
      return;
    }

    const endTimeISO = new Date(endTime).toISOString();

    if (new Date(endTimeISO) <= new Date()) {
      setError("End time must be in the future");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("startingPrice", startingPrice);
    formData.append("endTime", endTimeISO);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    try {
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }
      const data = await createAuction(formData);
      navigate(`/auctions/${data.auctionId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create auction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          List an item for auction
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Add a photo and the details buyers need to start bidding.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-8"
      >
        {/* Image upload / preview */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-slate-700">Photo</label>

          <div className="mt-2 relative aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-slate-900/70 text-white text-xs px-2 py-1 rounded-md hover:bg-slate-900 transition-colors"
                >
                  Remove
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 cursor-pointer text-slate-400 hover:text-amber-500 transition-colors p-6 text-center">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l-3 3m3-3l3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3.75 3.75 0 014.227 4.227 4.5 4.5 0 01-1.083 8.751"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Click to upload a photo
                </span>
                <span className="text-xs">PNG, JPG, or WEBP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Optional, but listings with a photo get more bids.
          </p>
        </div>

        {/* Form fields */}
        <div className="md:col-span-3 bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="e.g. iPhone 15 Pro Max"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              placeholder="Condition, included accessories, etc."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Starting Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                placeholder="50.00"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                End Time
              </label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-amber-500 text-slate-900 font-semibold py-2.5 rounded-md hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating listing..." : "List Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
