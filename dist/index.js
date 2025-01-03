"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = require("./app");
const socket_1 = require("./socket");
const app = (0, app_1.createApp)();
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.createSocketServer)(httpServer);
const PORT = 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
