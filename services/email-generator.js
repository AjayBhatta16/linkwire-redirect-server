function generateEmailBody(linkID, ipAddress, userAgent) {
    return `
        <h2>Your link with ID ${linkID} was just clicked.</h2>
        <hr/>
        <p>Here are the details:</p>
        <ul>
            <li><strong>IP Address:</strong> ${ipAddress}</li>
            <li><strong>User Agent:</strong> ${userAgent}</li>
        </ul>
        <p>View your dashboard to learn more.</p>`;
}

module.exports = {
    generateEmailBody,
};