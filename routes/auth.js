const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
var path = require('path');

router.post('/signup', async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;
        const userRole = role || 'user'; // Default to 'user' if no role provided
        const user = await User.create({ name, username, email, password, role: userRole });
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username,password)
        const user = await User.findOne({ where: { username, password } });
        
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/login/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username,password)
        const user = await User.findOne({ where: { username, password } });
        
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        if(user.role!=='admin'){
            return res.status(400).send({error:'You are not admin'});
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});



router.get('/login/page', async (req,res)=>{
    return res.sendFile(path.resolve('templates/login.html'))
});
router.get('/login/admin', async (req,res)=>{
    return res.sendFile(path.resolve('templates/adminlogin.html'))
});

router.get('/signup/page', async (req,res)=>{
    return res.sendFile(path.resolve('templates/signup.html'))
});
router.get('/admin/page', async (req,res)=>{
    return res.sendFile(path.resolve('templates/admin.html'))
});



module.exports = router;
