# nftstorage-service-worker

A service worker to fetch content from IPFS via nftstorage.link or a fallback gateway if it ever gets blocked.

nftstorage.link is a fast IPFS gateway. Sometimes the entire domain gets completely blocked by Google Safe Browsing, which leaves sites that link to it unable to get their content. This service worker fixes that by trying to fetch the content via nftstorage.link first, and if there is an error, fetching from alternate IPFS gateways instead. FAST & ROBUST!

## Getting started

- Copy `nftstorage-sw.js` into the root of your static website project.
- Register the service worker from a script tag or your main js bundle.
```js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('nftstorage-sw.js');
}
```

## References

- https://github.com/olizilla/see-other - a sw to resolve mutable dnslinks to their current immutable form for better caching.
- https://github.com/ipfs-shipyard/service-worker-gateway - run js-ipfs in a service worker.
