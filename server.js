/* ═══════════════════════════════════════════════════════════════
   خادم SODFA المحلي — Node.js (بديل عن python -m http.server)
   التشغيل:  node server.js
   ثم افتحي: http://localhost:8080
   ═══════════════════════════════════════════════════════════════ */
"use strict";
var http = require("http");
var fs = require("fs");
var path = require("path");

var PORT = process.env.PORT || 8080;
var ROOT = __dirname;

var MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

http.createServer(function (req, res) {
  var urlPath;
  try { urlPath = decodeURIComponent(req.url.split("?")[0]); } catch (e) { urlPath = "/"; }
  if (urlPath === "/") urlPath = "/index.html";
  /* منع الخروج من مجلد المشروع */
  var filePath = path.normalize(path.join(ROOT, urlPath));
  if (filePath.indexOf(ROOT) !== 0) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("403 Forbidden");
    return;
  }
  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found: " + urlPath);
      return;
    }
    var ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}).listen(PORT, function () {
  console.log("SODFA running →  http://localhost:" + PORT);
});