import path from 'path';
import JWT from 'jsonwebtoken';
import fs from 'fs';

import DB from "../models/mongo.js";

export default class getControllers {
    static homeController(req, res) {
        res.sendFile(path.join(process.env.ROOT, "/views/index.html"));
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
            if (await DB.isTokenInvoked(token)) {
                res.status(403).json({
                    success: false,
                    body: null,
                    message: "token invoked"
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
                            const newToken = await JWT.sign({ userEmail: payload.userEmail }, fs.readFileSync(path.join(process.env.ROOT, "/private.key")), { expiresIn: "7d", algorithm: "RS256" })
                            await res.cookie("JWT", newToken, { httpOnly: true });
                            await DB.invokeToken(token, (result) => {
                                client.close();
                            });
                            res.status(200).json({
                                success: true,
                                body: payload.userEmail,
                                message: "OK"
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