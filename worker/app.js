// importer bloggdata
import content from "./data.js";
export default {
  async fetch(request, env, ctx) {
    // bare behandle websocket oppgradering
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    // etabler websocket
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    
    // aksepter tilkobling
    server.accept();
    
    // behandle all inndata
    server.addEventListener("message", (event) => {
      let response = { status: 403, message: "License not valid" };

      // sjekk om lisensen er gyldig
      if (env.LICENSES.split(",").includes(event.data)) {
        response = { status: 200, data: content };
      }

      // send respons
      server.send(JSON.stringify(response));
    });
    return new Response(null, { status: 101, webSocket: client });
  }
};
