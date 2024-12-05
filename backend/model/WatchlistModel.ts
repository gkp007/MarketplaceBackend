import mongoose, { Document } from "mongoose";

interface IWatchList extends Document {
  userID: mongoose.Schema.Types.ObjectId;
  businessIDs: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const WatchlistSchema = new mongoose.Schema<IWatchList>({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  businessIDs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
    },
  ],
  createdAt: { type: Date },
});

const WatchlistModel = mongoose.model<IWatchList>("Watchlist", WatchlistSchema);
export default WatchlistModel;
