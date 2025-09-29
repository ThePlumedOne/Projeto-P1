const logs = (req, res) => {

    const startTime = Date.now();

    const formatLog = (method, url, status, userId, duration) =>
        `${method.padEnd(6, ' ')} - ${url.padEnd(15, ' ')} - user: ${userId ? userId.toString().padEnd(9, ' ') : 'annonymous'} - ${status} - ${duration}ms`

    res.on('finish', () => {
        const {method, url, userId} = req
        const {status} = res
        const duration = Date.now() - startTime;

        console.log(`${formatLog(method, url, userId, duration)} - ${duration}ms`)
    })

    module.exports = {
        logs
    }
}