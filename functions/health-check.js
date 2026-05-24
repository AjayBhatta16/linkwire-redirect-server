module.exports = app => {
    app.get('/health-check', (_, res) => res.status(200).message('The App is Running'))
}