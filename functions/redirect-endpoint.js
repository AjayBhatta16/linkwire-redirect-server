const DataEditor = require('../services/data-editor');
const requestIp = require('request-ip')

const dataEditor = new DataEditor();

module.exports = app => {
    app.get('/:id', async (req, res) => {
        console.log("getting link record by redirect ID...");

        if (req.params.id.length !== 6) {
            res.status(404);
        }

        let link = await dataEditor.getLinkByDisplayID(req.params.id);
        console.log(link);

        console.log(`getting user record for link owner: ${link.createdBy}...`);

        let userAgent = req.get('User-Agent');

        let postClickRequest = {
            linkID: req.params.id,
            ipAddress: requestIp.getClientIp(req),
            userAgent,
        };

        // TODO: submit to post-click pubsub topic

        console.log("rendering redirect page...");

        res.render('redirect', {
            targetURL: link.redirectURL, 
            title: link.siteTitle,
            description: link.siteDescription,
            bannerURL: link.siteBannerURL,
        });
    });
}