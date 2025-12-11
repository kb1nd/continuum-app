// importer bloggdata
import content from "./bloggdata.js";
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
    server.onmessage = (event) => {
      let response = { status: 403, message: "License not valid" };
      //const licenses = env.LICENSES.split(",");

      // sjekk om lisensen er gyldig
      try {
        //if (licenses.includes(event.data)) response = { status: 200, data: content };
        response = { status: 200, data: env.LICENSES };
        // send respons
        server.send(JSON.stringify(response));
      } catch (err) {
        server.send(JSON.stringify({ status: 500, error: err.message }))
      }
    };
    return new Response(null, { status: 101, webSocket: client });
  }
};
