import DB from '../models/mongo.js';

export default class postController {
    static signUp(req, res) {
        if (req.body.username && req.body.email && req.body.password) {
            if (!(req.body.username.length > 5)) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "username should be greater than 5 character"
                });
                return;
            } else if (!(req.body.password.length >= 8)) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "password should be greater than or equal to 8 character"
                });
                return;
            }

            const emailValidation = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email);

            if (!emailValidation) {
                res.status(400).json({
                    success: false,
                    body: null,
                    message: "email is not valid"
                });
                return;
            }

            DB.connect(async (client) => {
                try {
                    const response = await DB.insertUser(req.body.username, req.body.email, req.body.password);
                    if (response.acknowledged) {
                        res.status(201).json({
                            success: true,
                            body: response.insertedId,
                            message: "OK"
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            body: null,
                            message: "Internal Error"
                        });
                    }
                } catch (e) {
                    if (e.message.includes("E11000 duplicate key error collection")) {
                        res.status(409).json({
                            success: false,
                            body: null,
                            message: "this username or email used before"
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            body: null,
                            message: "Internal Error"
                        });
                    }
                }
                client.close();
            });
        } else {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid Input"
            });
        }
    }

    static signOut(req, res) {
        if (!req.cookies.JWT) {
            res.status(400).json({
                success: false,
                body: null,
                message: "not authorized"
            });
            return;
        }
        DB.connect(async (client) => {
            try {
                if (await DB.isTokenInvalid(req.cookies.JWT)) {
                    await res.clearCookie("JWT");
                    res.status(400).json({
                        success: false,
                        body: null,
                        message: "invalidate already"
                    });
                    return;
                }
                DB.invalidateToken(req.cookies.JWT, async (result) => {
                    if (result.acknowledged) {
                        await res.clearCookie("JWT");
                        res.status(200).json({
                            success: true,
                            body: null,
                            message: "OK"
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            body: result,
                            message: "internal error"
                        });
                    }
                    client.close();
                });
            } catch (e) {
                client.close();
                res.status(500).json({
                    success: false,
                    body: e.message,
                    message: "internal error"
                });
            }
        });
    }
}