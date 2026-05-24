const fs = require('fs')
const uuid = require('uuid')
const http = require('http')
const bcrypt = require("bcrypt");
const path = require('path')

const firebaseAdmin = require("firebase-admin")
const { initializeApp } = require("firebase-admin/app")

const resolvedDbKeyFilePath = path.resolve(
    __dirname.split('/services')[0].split('\\services')[0], 
    "secrets/serviceAccountKey.json"
);

const firestoreServiceAccountKey = require(resolvedDbKeyFilePath);

const collections = {
    USERS: 'users',
    LINKS: 'links',
    CLICKS: 'clicks'
}


class DataEditor {
    constructor() {
        initializeApp({
            credential: firebaseAdmin.credential.cert(firestoreServiceAccountKey),
        });

        this.db = firebaseAdmin.firestore();
    }

    // CRUD interfaces
    async readOne(collectionName, filter = (data => data)) {
        try {
            const snapshot = await this.db.collection(collectionName).get();
            const allData = snapshot.docs.map(doc => doc.data());
            const filteredData = allData.filter(filter);

            return {
                success: true,
                item: filteredData[0],
            };
        } catch(error) {
            console.log(`Error reading data from ${collectionName}: ${error}`);
            return {
                success: false,
                error,
            };
        }
    }

    async getUser(username) {
        const dbResult = await this.readOne(
            collections.USERS,
            (data => 
                (data.username === username || data.email === username)
            )
        );

        return dbResult.item;
    }

    async getLinkByDisplayID(displayID) {
        const dbResult = await this.readOne(
            collections.LINKS,
            (data =>
                data.displayID === displayID
            )
        );

        return dbResult.item;
    }
}

module.exports = DataEditor