import monk from "monk";
import dotenv from "dotenv";
dotenv.config();
const db = monk(process.env.MONGO_URI as string);
export default db;
