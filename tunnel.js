/**
 * Created by linmu on 2017/9/12.
 */

const http = require('http')
const net = require('net')
const url = require('url')

const log = console.log.bind(console)

const proxy = http.createServer()

const connect = function (cReq, cpSock, head) {
    let u = url.parse(`http://${cReq.url}`)

    let psSock = net.connect(u.port, u.hostname, function () {
        cpSock.write('HTTP/1.1 200 Connection Established\r\n' +
                     'Proxy-agent: Node.js-Proxy\r\n\r\n')
        psSock.write(head)
        if (cReq.url === 'www.baidu.com:443') {
            log('first')
        }
        psSock.pipe(cpSock)
        cpSock.pipe(psSock)
    }).on('error', () => {
        cpSock.end()
    })
}

proxy.on('connect', connect).on('error', () => {})
proxy.listen(3000, '0.0.0.0')
setInterval(proxy.getConnections.bind(proxy, (err, count) => log('count: ', count)), 1000)