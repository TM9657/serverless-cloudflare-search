# Serverless Search on Cloudflare (using fast workers on the edge!!)

endpoints:
*/search*   - public
*/index*    - access restricted (see config)

Cached Index saved in R2. Cache read on search request. 
Queue -> Writing Index (Batch size and concurrency 0)