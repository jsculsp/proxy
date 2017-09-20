/**
 * Created by linmu on 2017/9/20.
 */

const http = require('http')
const log = console.log.bind(console)

let options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '3d.fuwo.com:80',
    method: 'CONNECT',
}

let req = http.request(options)

req.on('connect', function (res, socket) {
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: 3d.fuwo.com\r\n' +
                 'Connection: closed\r\n' +
                 '\r\n')

    socket.on('data', function (chunk) {
        log(chunk.toString())
    })

    socket.on('end', function () {
        log('socket end.')
    })
})

req.end()