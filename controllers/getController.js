import path from 'path';

export default class getControllers {
    static homeController(req, res) {
        res.sendFile(path.join(process.env.ROOT, "/views/index.html"));
    }
}