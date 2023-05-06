# Serverless Search on Cloudflare
Using Cloudflare Worker + Queues + R2 Storage (+ Cache, TODO) to implement a small scale to zero search system that is reasonably fast and cheap.
Benchmark welcome for performance measure :)

Endpoints:
- */search*   - public
- */index*    - access restricted (see config)

Cached Index saved in R2. Cache read on search request. 
Queue -> Writing Index (Batch size and concurrency 0)

## Features
- Generic Index support
- Multiple Parallel indices per endpoint (infinite)
- Good performance for smaller Datasets (up to 50k documents (I guess? Feel free to create a better benchmark!))

## Setup
create a .env file in your root with the following parameter: 
```
CLOUDFLARE_AUTH_KEY=
CLOUDFLARE_AUTH_EMAIL=
CLOUDFLARE_API_TOKEN=
```

Install: `pnpm install`
Init: `pnpm run initialize`
Build: `npx turbo build`

## "Benchmark"
This project is meant for smaller datasets (cheap serverless search).
For a movie dataset with **17920 documents** a search takes *800ms first time* (downloading the index from R2), after that we get a worker performance of *50-60ms per search*.

## Todo
- Cache index-file for faster initial response
- Alternative Flexsearch implementation (Problems with export / import and types)