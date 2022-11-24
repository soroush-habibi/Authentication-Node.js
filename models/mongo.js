import mongodb from 'mongodb';

export default class mongoDB {
    static async connect(func) {
        try {
            this.client = await mongodb.MongoClient.connect(process.env.MONGODB_URL);
            func(this.client);
        } catch (e) {
            console.log(e.message);
            process.exit(1);
        }
    }

    static async existsUser(username, email) {
        const result = await this.client.db("Auth").collection("users").findOne({ $or: [{ username: username }, { email: email }] });
        return result;
    }

    static async insertUser(username, email, password) {
        const result = await this.client.db("Auth").collection("users").insertOne({ username: username, email: email, password: password, lastLogin: new Date() });
        return result;
    }
}