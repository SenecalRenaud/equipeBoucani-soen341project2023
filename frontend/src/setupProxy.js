// const proxy = require('http-proxy-middleware');
// const {createProxyMiddleware} = require("http-proxy-middleware");
// const endpoint_routes = [
//
// ]
// module.exports = function(app) {
//     app.use(
//     createProxyMiddleware('/api1', {
//       target: 'https://b87baeb75efe.ngrok.io', // API endpoint 1
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api1": "",
//       },
//       headers: {
//         Connection: "keep-alive"
//       }
//     })
//   );
//   app.use(
//     createProxyMiddleware('/api2', {
//       target: 'https://c43694c322b8.ngrok.io', // API endpoint 2
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api2": "",
//       },
//       headers: {
//         Connection: "keep-alive"
//       }
//     })
//   );
//     //
//     // app.use(proxy('/api/putobject',{target:'http://127.0.0.1:5000'}));
//     // app.use(proxy('/api/getobject',{target:'http://server2.com'}));
// }