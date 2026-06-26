import { useState, useEffect, useCallback, useRef } from "react";
import { getAuctionById, getBidsForAuction } from "../services/auctionApi";
import { extractBids } from "../utils/format";

export const useAuctionDetails = (id) => {
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ignoreRef = useRef(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [auctionData, bidsData] = await Promise.all([
        getAuctionById(id),
        getBidsForAuction(id),
      ]);
      if (ignoreRef.current) return;
      setAuction(auctionData.auction);
      setBids(extractBids(bidsData));
    } catch (err) {
      if (ignoreRef.current) return;
      console.error(err);
      setError(err.response?.data?.message || "Failed to load auction");
    }
  }, [id]);

  useEffect(() => {
    ignoreRef.current = false;
    setLoading(true);
    load().finally(() => {
      if (!ignoreRef.current) setLoading(false);
    });
    return () => {
      ignoreRef.current = true;
    };
  }, [load]);

  return { auction, bids, loading, error, refetch: load };
};