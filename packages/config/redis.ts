import Redis from "ioredis";
import { REDIS_URI } from "./env";

const redis = new Redis(REDIS_URI);

export default redis;
