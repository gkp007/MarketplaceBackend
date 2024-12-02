import mongoose, { Document, Schema } from "mongoose";

interface IAnalytics extends Document {
  totalUsers: number;
  businessProfileVisits: [
    {
      business: mongoose.Schema.Types.ObjectId;
      visits: number;
    }
  ];
}

const AnalyticsSchema = new Schema<IAnalytics>({
  totalUsers: { type: Number, default: 0 },
  businessProfileVisits: [
    {
      business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
      visits: { type: Number, default: 0 },
    },
  ],
});
const Analytics = mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);
export default Analytics;
