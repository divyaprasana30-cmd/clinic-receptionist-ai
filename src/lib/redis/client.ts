import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const CONVERSATION_TTL = 60 * 60 * 24;

export function getConversationKey(clinicId: string, phone: string) {
  return `conversation:${clinicId}:${phone}`;
}
