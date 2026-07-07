import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const port = Number(process.env.PORT || 8888);

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml'
};

const server = createServer((request, response) => {
  const requestedPath = new URL(request.url, `http://${request.headers.host}`).pathname;
  const safePath = normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  const filePath = join(publicDir, safePath === '/' ? 'index.html' : safePath);
  const resolvedPath = existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(publicDir, 'index.html');
  const type = mimeTypes[extname(resolvedPath)] || 'application/octet-stream';

  response.writeHead(200, {
    'Content-Type': type,
    'X-Content-Type-Options': 'nosniff'
  });
  createReadStream(resolvedPath).pipe(response);
});

server.listen(port, () => {
  console.log(`Serving public at http://localhost:${port}`);
});
