const DataEditor = require('../services/data-editor');
const { generateEmailBody } = require('../services/email-generator');
const requestIp = require('request-ip')

const { PubSub } = require('@google-cloud/pubsub');

const dataEditor = new DataEditor();

module.exports = app => {
    app.get('/:id', async (req, res) => {
        console.log('path:', req.path);
        console.log('params:', req.params);
        console.log('all headers:', JSON.stringify(req.headers, null, 2));
        console.log('remoteAddress:', req.socket.remoteAddress);
        console.log('clientIp:', requestIp.getClientIp(req));

        console.log("getting link record by redirect ID...");

        if (req.params.id.length !== 6) {
            res.status(404);
        }

        let link = await dataEditor.getLinkByDisplayID(req.params.id);
        console.log(link);

        console.log(`getting user record for link owner: ${link.createdBy}...`);

        let user = await dataEditor.getUser(link.createdBy);
        console.log(user);

        console.log('extracting user agent and client IP address...');

        let userAgent = req.get('User-Agent');
        let ipAddress = req.headers['cf-connecting-ip'] ?? requestIp.getClientIp(req);

        console.log('IP Address extracted:', ipAddress);

        console.log('publishing click data to pub/sub...');

        let postClickRequest = {
            linkID: req.params.id,
            ipAddress,
            userAgent,
        };

        await publishJsonMessage('post-click-topic', postClickRequest);

        console.log('sending email notification to link owner...');

        let emailRequest = {
            to: user.email,
            subject: `Your link was clicked!`,
            body: generateEmailBody(req.params.id, ipAddress, userAgent),
        }

        await publishJsonMessage('send-email-topic', emailRequest);

        console.log("rendering redirect page...");

        res.render('redirect', {
            targetURL: link.redirectURL, 
            title: link.siteTitle,
            description: link.siteDescription,
            bannerURL: link.siteBannerURL,
        });
    });
}

async function publishJsonMessage(topicName, jsonData) {
  const pubsub = new PubSub();

  const messageId = await pubsub.topic(topicName).publish(
    Buffer.from(JSON.stringify(jsonData))
  );

  console.log(`Message ${messageId} published`);
}