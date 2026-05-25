module.exports = app => {
    app.get('/_ah/health', (_, res) => res.status(200).send('ok'));
    app.get('/_ah/start', (_, res) => res.status(200).send('ok'));
    app.get('/_ah/stop', (_, res) => res.status(200).send('ok'));
}