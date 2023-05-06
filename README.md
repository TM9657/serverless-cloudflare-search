# Serverless Search on Cloudflare
Using Cloudflare Worker + Queues + R2 Storage + Cache to implement a small scale to zero search system that is reasonably fast and cheap.
Benchmark welcome for performance measure :)

Endpoints:
- */search*   - public
- */index*    - access restricted (see config)

Cached Index saved in R2. Cache read on search request. 
Queue -> Writing Index (Batch size and concurrency 0)

## Setup
Install: `pnpm install`
Build: `npx turbo build`