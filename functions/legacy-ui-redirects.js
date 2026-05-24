module.exports = app => {
    app.get('/', (_, res) => {
        res.redirect('https://app.linkwire.cc')
    })

    app.get('/login', (_, res) => {
        res.redirect('https://app.linkwire.cc/login')
    })

    app.get('/signup', (_, res) => {
        res.redirect('https://app.linkwire.cc/signup')
    })

    app.get('/dashboard', (_, res) => {
        res.redirect('https://app.linkwire.cc/dashboard')
    })

    app.get('/viewlink/:id', async (req, res) => {
        res.redirect(`https://app.linkwire.cc/viewlink/${req.params.id}`)
    })
}