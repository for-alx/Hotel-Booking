import config from "../config.js"

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (config.ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

export default credentials
