const http = require('http');
const server = http.createServer((req, res) => {
    res.end("{success: true}");
});

server.listen(process.env.PORT || 3000);