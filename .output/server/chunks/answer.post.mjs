import { defineEventHandler } from 'h3';
import { R as RateLimiter } from './rate-limiter.mjs';

RateLimiter.bundle([
  // Every 1 minutes 10 times
  new RateLimiter(10, 1 * 60 * 1e3),
  // Every 1*60 minutes 100 times
  new RateLimiter(100, 1 * 3600 * 1e3),
  // Every 4*60 minutes 200 times
  new RateLimiter(200, 4 * 3600 * 1e3),
  // Every 24*60 minutes 500 times
  new RateLimiter(500, 24 * 3600 * 1e3)
]);
const answer_post = defineEventHandler(async (event) => {
  return { error: "STAY TUNED" };
});

export { answer_post as default };
//# sourceMappingURL=answer.post.mjs.map
