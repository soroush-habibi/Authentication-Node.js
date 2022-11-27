import path from 'path';
import JWT from 'jsonwebtoken';
import fs from 'fs';
import url from 'url';

import DB from "../models/mongo.js";

export default class getControllers {
    static homeController(req, res) {
        res.sendFile(path.join(process.env.ROOT, "/views/index.html"));
    }

    static login(req, res) {
        if (!(req.query.input && req.query.password)) {
            res.status(400).json({
                success: false,
                body: null,
                message: "Invalid Input"
            });
            return;
        }
        DB.connect(async (client) => {
            try {
                const result = await DB.loginUser(req.query.input, req.query.password);
                if (result === 0) {
                    const token = JWT.sign({ userEmail: req.query.input }, fs.readFileSync(path.join(process.env.ROOT, "/private.key")), { expiresIn: "7d", algorithm: "RS256" });
                    res.cookie("JWT", token, { httpOnly: true, expires: new Date(Date.now() + 604800000) });
                    res.status(200).json({
                        success: true,
                        body: null,
                        message: "OK"
                    });
                } else if (result === 1) {
                    res.status(203).json({
                        success: false,
                        body: null,
                        message: "wrong username or email"
                    });
                } else if (result === 2) {
                    res.status(203).json({
                        success: false,
                        body: null,
                        message: "wrong password"
                    });
                }
            } catch (e) {
                res.status(500).json({
                    success: false,
                    body: null,
                    message: e.message
                });
            }
            client.close()
        });
    }

    static async authorization(req, res) {
        const token = req.cookies.JWT;
        if (!token) {
            res.status(403).json({
                success: false,
                body: null,
                message: "not authorized"
            });
            return;
        }

        DB.connect(async (client) => {
            if (await DB.isTokenInvalid(token)) {
                await res.clearCookie("JWT");
                res.status(403).json({
                    success: false,
                    body: null,
                    message: "token invalidated"
                });
            } else {
                try {
                    JWT.verify(token, fs.readFileSync(path.join(process.env.ROOT, "/public.key")), async (err, payload) => {
                        if (err) {
                            res.status(403).json({
                                success: false,
                                body: null,
                                message: "not authorized"
                            });
                        } else {
                            const newToken = JWT.sign({ userEmail: payload.userEmail }, fs.readFileSync(path.join(process.env.ROOT, "/private.key")), { expiresIn: "7d", algorithm: "RS256" })
                            await res.cookie("JWT", newToken, { httpOnly: true, expires: new Date(Date.now() + 604800000) });
                            await DB.invalidateToken(token, (result) => {
                                if (result.acknowledged) {
                                    res.status(200).json({
                                        success: true,
                                        body: payload.userEmail,
                                        message: "OK"
                                    });
                                    client.close();
                                } else {
                                    res.status(500).json({
                                        success: false,
                                        body: result,
                                        message: "internal error"
                                    });
                                    client.close();
                                }
                            });
                        }
                    });
                } catch (e) {
                    res.status(500).json({
                        success: false,
                        body: null,
                        message: e.message
                    });
                }
            }
        });
    }
}