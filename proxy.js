/**
 * Created by linmu on 2017/9/11.
 */

const http = require('http')
const url = require('url')

const log = console.log.bind(console)

let counts = 0

const request = function (cReq, cRes) {
    counts += 1
    log(`这个代理已经被访问了${counts}次！`)
    let u = url.parse(cReq.url)

    log('url: ', cReq.url)

    let options = {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.path,
        method: cReq.method,
        headers: cReq.headers,
    }

    log('options: ', options)

    let pReq = http.request(options, function (pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers)
        pRes.pipe(cRes)
    }).on('error', function () {
        cRes.end()
    })

    cReq.pipe(pReq)
}

const server = http.createServer()
server.on('request', request)
server.listen(23333, '0.0.0.0')