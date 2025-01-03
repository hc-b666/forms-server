import { createServer } from 'http';
import { createApp } from './app';
import { createSocketServer } from './socket';

const app = createApp();
const httpServer = createServer(app);
createSocketServer(httpServer);

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
