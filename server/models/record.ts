import Mongoose from "mongoose";

const { Schema } = Mongoose;

interface IRecord {
  title: string;
  artist: string;
  year: number;
  image: string;
}

const RecordSchema = new Schema<IRecord>({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  year: { type: Number, required: true },
  image: { type: String, required: true },
});

export default Mongoose.model<IRecord>("Record", RecordSchema);
