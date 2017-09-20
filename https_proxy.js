/**
 * Created by linmu on 2017/9/20.
 */

const http = require('http')
const https = require('https')
const net = require('net')
const fs = require('fs')
const url = require('url')

const log = console.log.bind(console)

const request = function (cReq, cRes) {
    let u = url.parse(cReq.url)

    log('headers: ', cReq.headers)
    log('hostname: ', u.hostname)

    let options = {
        hostname: u.hostname,
        port: u.port || 80,
        path: u.path,
        method: cReq.method,
        headers: cReq.headers,
    }

    let pReq = http.request(options, function (pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers)
        pRes.pipe(cRes)
    }).on('error', function () {
        cRes.end()
    })

    cReq.pipe(pReq)
}

const connect = function (cReq, cSock) {
    let u = url.parse('http://' + cReq.url)

    log(u.hostname)

    let pSock = net.connect(u.port, u.hostname, function () {
        cSock.write('HTTP/1.1 200 Connection Established\r\n\r\n')
        pSock.pipe(cSock)
    }).on('error', function () {
        cSock.end()
    })

    cSock.pipe(pSock)
}

let options = {
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./public.crt'),
}

const s = https.createServer(options)
s.on('request', request)
s.on('connect', connect)
s.listen(3000, '127.0.0.1')