const express = require('express');
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const User = require("../models/User");
const Purchase = require('../models/Purchase');
const router = express.Router();

router.post('/item', async (req, res) => {
    const { name, price, quantity } = req.body;
    const newItem = new Item({ name, price, quantity });
    try {
        await newItem.save();
        res.status(201).send({ message: 'Item added successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.post('/deleteitem/:id', async (req, res) => {
    const id =  req.params.id;
    
    try {
        const item = await Item.findByPk(id);
        await item.destroy();
        res.status(201).send({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

router.get('/users',auth,async (req,res)=>{
    try {
        const users = await User.findAll(); // Retrieve all users from the database
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/generate-tokens', async (req, res) => {
    const {userId, amount } = req.body;

    try {
        // Find the user by ID
        const user = await User.findOne({where:{username:userId}});
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Update user's token balance
        user.tokenBalance += parseInt(amount); // Increase balance by the specified amount
        await user.save(); // Save the updated user

        res.send({ message: `Successfully added ${amount} tokens to user ${user.username}`, newBalance: user.tokenBalance });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/purchase-requests', async (req, res) => {
    try {
        const requests = await Purchase.findAll();
        const newlist = await Promise.all(requests.map(async (i) => {
        console.log(i.id)
            const user = await User.findByPk(i.userId);
            const item = await Item.findByPk(i.itemId);

            return {
                id: i.id,
                userId: user.id,
                userName: user.name,
                itemId: item.id,
                itemName: item.name,
                quantity: i.quantity,
                price: item.price,
                total: item.price * i.quantity,
                status: i.status
            };
        }));
        console.log(newlist);
        res.send(newlist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post(`/confirm-request/:reqid`, async (req, res)=>{
    const reqId = req.params.reqid;
    try {
        const requests = await Purchase.findByPk(reqId);
        requests.status = 'confirmed'
        requests.save();
        return res.send({status:'success'})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/items', async (req, res) => {
    try {
        const requests = await Item.findAll();
        res.send(requests);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.post('/additem', async (req, res) => {
    const {name, price, quantity} = req.body;
    try {
        await Item.create({name,price,quantity})
        res.send({status:"success"})
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});




// Admin can confirm purchase requests
router.post('/purchase-requests/:id/confirm', async (req, res) => {
    const requestId = req.params.id;

    try {
        const request = await PurchaseRequest.findByPk(requestId);
        if (!request) {
            return res.status(404).send({ error: 'Purchase request not found' });
        }

        request.status = 'confirmed';
        await request.save();

        // Optionally, you can also create a corresponding transaction
        await Transaction.create({
            userId: request.userId,
            amount: request.quantity * 10, // Example: Assuming each item costs 10 tokens
            type: 'debit',
            status: 'completed',
        });

        res.send({ message: 'Purchase request confirmed', request });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



module.exports = router;
