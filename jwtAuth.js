const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Token nao enviado' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token nao enviado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: 'Token invalido' });

        req.user = user;
        next();
    });
}

module.exports = jwtAuth;
