const fs = require('fs');
const http = require('http');
const Path = require('path');
const URL = require('url');

async function main() {
    console.clear();

    const server = http.createServer((req, res) => {
        const url = URL.parse(req.url);
    
        switch(url.pathname) {
            case '/':
            case '/index.html':
                res.writeHead(200, 'OK', {
                    'Content-Type': 'text/html'
                });
    
                fs.createReadStream(Path.join(__dirname, '/public/index.html')).pipe(res);
                break;
    
            case '/main.js':
                res.writeHead(200, 'OK', {
                    'Content-Type': 'text/javascript'
                });
    
                fs.createReadStream(Path.join(__dirname, '/public/main.js')).pipe(res);
                break;

            case '/audio':
                res.writeHead(200, 'OK', {
                    'Content-Type': 'text/plain'
                });
    
                const s = fs.createReadStream(Path.join(__dirname, '/input.raw'));

                s.on('data', c => {
                    res.write(new Float32Array(c.buffer).toString());
                });
                break;
        }
    });
    
    server.listen(80, () => console.log(`Server is listening at port ${server.address()['port']};`));
}

main().catch(console.error);