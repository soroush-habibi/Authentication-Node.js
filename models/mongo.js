import mongodb from 'mongodb';
import bcrypt from 'bcrypt';

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
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await this.client.db("Auth").collection("users").insertOne({ username: username, email: email, password: hashedPassword, lastLogin: new Date() });
        return result;
    }

    static async loginUser(input, password) {
        const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input);
        let result;

        if (emailValidation) {
            if (await this.existsUser(null, input)) {
                result = await this.client.db("Auth").collection("users").findOne({ email: input });
                if (await bcrypt.compare(password, result.password)) {
                    await this.client.db("Auth").collection("users").updateOne({ email: input }, { $set: { lastLogin: new Date() } });
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
                if (await bcrypt.compare(password, result.password)) {
                    await this.client.db("Auth").collection("users").updateOne({ username: input }, { $set: { lastLogin: new Date() } });
                    return 0;
                } else {
                    return 2;
                }
            } else {
                return 1;
            }
        }
    }

    static async invalidateToken(token, func) {
        const result = await this.client.db("Auth").collection("invalidateToken").insertOne({ token: token });
        func(result);
    }

    static async isTokenInvalid(token) {
        const result = await this.client.db("Auth").collection("invalidateToken").findOne({ token: token });
        return result ? true : false;
    }
}