<a href="https://tm9657.de?ref=github"><p align="center"><img width=250 src="https://cdn.tm9657.de/tm9657/images/serverless_search.png" /></p></a>
<p align="center">
    <a href="https://tm9657.de"><img src="https://img.shields.io/badge/website-more_from_us-C0222C.svg?style=flat&logo=PWA"> </a>
	  <a href="https://discord.ca9.io"><img src="https://img.shields.io/discord/673169081704120334?label=discord&style=flat&color=5a66f6&logo=Discord"></a>
	  <a href="https://twitter.com/tm9657"><img src="https://img.shields.io/badge/twitter-follow_us-1d9bf0.svg?style=flat&logo=Twitter"></a>
	  <a href="https://www.linkedin.com/company/tm9657/"><img src="https://img.shields.io/badge/linkedin-connect-0a66c2.svg?style=flat&logo=Linkedin"></a>
    <a href="https://merch.ca9.io"><img src="https://img.shields.io/badge/merch-support_us-red.svg?style=flat&logo=Spreadshirt"></a>
</p>

# 🔍🌩️ Serverless Search on Cloudflare
Using Cloudflare Worker + Queues + R2 Storage (+ Cache, TODO) to implement a small scale to zero search system that is reasonably fast and cheap.
Benchmark welcome for performance measure :)

Endpoints:
- **search**   - public
- **index**    - access restricted (see config)

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

> - `pnpm install` ➡️ populates your config with a strong secret
> - `pnpm run initialize` ➡️ creates the bucket and queue
> - `npx turbo build` ➡️ publishes your workers to cloudflare

## "Benchmark"
This project is meant for smaller datasets (cheap serverless search).
For a movie dataset with **17920 documents** a search takes *800ms first time* (downloading the index from R2), after that we get a worker performance of *50-60ms per search*.

## Todo
- Cache index-file for faster initial response
- Alternative Flexsearch implementation (Problems with export / import and types)
- Investigate Durable Object for faster initial response
- Add serverless setup for AWS deployment

**Provided by TM9657 GmbH with ❤️**
### Check out some of our products:
- [Kwirk.io](https://kwirk.io?ref=github) (Text Editor with AI integration, privacy focus and offline support)
