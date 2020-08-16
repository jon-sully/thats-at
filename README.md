# JAMstack URL Shortener - "That's at..."

No database, no runtime, just a static app that updates itself via GitHub gateway and uses serverless functions until the new version is built and deployed.

**Powered by Netlify**

This app takes a number of nods from Phil Hawksworth (https://www.hawksworx.com) both in respect to realizing how clever the `.at` TLD extension is for URL redirectors and in understanding the serverless-functions-as-a-fallback workflow described in ["Pre-Generated JAMstack Sites with Serverless Rendering as a Fallback"](https://css-tricks.com/static-first-pre-generated-jamstack-sites-with-serverless-rendering-as-a-fallback/). Cheers, Phil 🙂

The idea is this: when you reach the [home page](https://thats.at), you can enter a URL to be shortened. When you submit that URL, a serverless function with my GitHub personal access token actually adds a new line directly to the `_redirects` file. This in turn kicks off a new Netlify build for the site wherein the short URL generated in the Function will be permanent and a fixture of the Netlify Edge CDN. Yay! Not just URL redirects, _geographically distributed_ URL redirects!

In the time between the Function writing a new line in `_redirects` and the build finishing and going live (roughly 24 seconds), there's another function that all routes fall back to. It too reaches out to GitHub to check and see if you're looking for a redirect that exists in GitHub but Netlify hasn't quite built yet, then redirects you properly itself 👍🏻

All that to say, this a full-fledged redirect engine with a serverless function to correctly handle redirects for the first 30ish seconds from an AWS server, then permanent globally-distributed redirects about 30 seconds after Submit via Netlify Edge CDN. 

No databases, no servers, just a good little redirection service with a neat name.

💯
