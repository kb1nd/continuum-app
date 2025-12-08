export default {
  async fetch(request) {
    return new Response("Hello World from Cloudflare Worker!");
  },
};
