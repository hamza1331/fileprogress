const os = require('os');
const http = require('http');
const util = require('util');

const Formidable = require('formidable')

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(`
      <form action="/upload" enctype="multipart/form-data" method="post">
        <input type="text" name="title"><br>
        <input type="file" name="someCoolFiles" multiple><br>
        <button>Upload</button>
      </form>
    `);
  } else if (req.url === '/upload') {
    const form = new Formidable({ multiples: true, uploadDir: os.tmpdir() });
    const files = [];
    const fields = [];

    form
      .on('field', (fieldName, value) => {
        fields.push({ fieldName, value });
      })
      .on('file', (fieldName, file) => {
        files.push({ fieldName, file });
      })
      .on('progress',(br,be)=>{
        console.log('expredted->',be)
        console.log('received->',br)
      })
      .on('end', () => {
        console.log('-> upload done');
        res.writeHead(200, { 'content-type': 'text/plain' });
        res.write(`received fields:\n\n${util.inspect(fields)}`);
        res.write('\n\n');
        res.end(`received files:\n\n${util.inspect(files)}`);
      });
    form.parse(req);
  } else {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404');
  }
});

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});