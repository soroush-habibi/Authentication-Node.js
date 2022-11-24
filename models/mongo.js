import mongodb from 'mongodb';

export default class mongoDB {
    static async connect(func) {
        try {
            this.client = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
            func();
        } catch (e) {
            console.log(e.message);
            process.exit(1);
        }
    }

    static async existsUser(username, email) {

    }
}