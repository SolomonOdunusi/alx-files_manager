import express from 'express';
import controllerRouting from './routes/index';

const PORT = process.env.PORT || 5000;
const server = express();

server.use(express.json());
controllerRouting(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
