const jwt = require('jsonwebtoken');
const User = require('../models/User');

const admincheck = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findByPk(decoded.id);
        if (!req.user) throw new Error();
        if(req.user.role!=="admin") return res.status(401).send({ error: "not admin" }); 
        next();
    } catch (e) {
        res.status(401).send({ error: e });
    }
};

module.exports = admincheck;
