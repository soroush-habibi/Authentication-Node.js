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
        const result = await this.client.db("Auth").collection("users").countDocuments({ $or: [{ username: username }, { email: email }] });
        return result > 0 ? true : false;
    }

    static async insertUser(username, email, password) {
        const result = await this.client.db("Auth").collection("users").insertOne({ username: username, email: email, password: password, lastLogin: new Date() });
        return result;
    }

    static async loginUser(input, password) {
        const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input);
        let result;

        if (emailValidation) {
            if (await this.existsUser(null, input)) {
                result = await this.client.db("Auth").collection("users").findOne({ email: input });
                if (result.password == password) {
                    return 0;
                } else {
                    return 2;
                }
            } else {
                return 1;
            }
        } else {
            if (await this.existsUser(input, null)) {
                result = await this.client.db("Auth").collection("users").findOne({ username: input });
                if (result.password == password) {
                    return 0;
                } else {
                    return 2;
                }
            } else {
                return 1;
            }
        }
    }
}