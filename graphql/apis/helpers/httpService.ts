import config from 'config';
import http from 'http';
import https from 'https';

async function get(url) {
  const server = config.https?.enabled ? https : http;
  const baseUrl = config.https?.enabled ? 'https://localhost:9001' : 'http://localhost:9001';
  const newUrl = url.startsWith('http') ? url : baseUrl.concat(url);

  const result = await new Promise((resolve, reject) => {
    server.get(newUrl, (res) => {
      const data = [];

      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => {
        resolve(Buffer.concat(data).toString());
      });
    }).on('error', (err) => {
      reject(err);
    });
  });

  return result;
}

const httpService = {
  get,
};

export default httpService;
