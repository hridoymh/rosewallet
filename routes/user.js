const express = require('express');
const User = require('../models/User');
const Item = require('../models/Item');
const Transaction = require("../models/Transaction")
const Purchase = require("../models/Purchase")
const auth = require('../middleware/auth');
const path = require('path')
const router = express.Router();

router.get('/balance', auth, (req, res) => {
    res.send({ balance: req.user.tokenBalance });
});

router.get('/items', auth, async (req, res)=>{
    try {
        const items = await Item.findAll();
        res.send(items);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})




router.get('/me', auth, async (req, res) => {
    try {
        // The authenticated user is available on req.user
        const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'username', 'email', 'tokenBalance'] });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        res.send(user);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// User sends a purchase request
router.post('/purchase-requests', auth, async (req, res) => {
    const { itemId, quantity } = req.body;

    try {
        // Check if the item exists
        const item = await Item.findByPk(itemId);
        
        if (!item || item.quantity<1) {
            return res.status(404).send({ error: 'Item not found' });
        }

        // Check if the user has enough token balance
        const user = await User.findByPk(req.user.id);
        const totalCost = item.price * quantity;

        if (user.tokenBalance < totalCost) {
            return res.status(400).send({ error: 'Insufficient token balance' });
        }

        // Create a new purchase request
        const purchaseRequest = await Purchase.create({
            userId: req.user.id,
            itemId,
            quantity,
            status: 'pending', // Initially set to pending
        });

        // Optionally, deduct tokens from the user's balance
        user.tokenBalance -= totalCost;
        await user.save(); // Save updated user balance

        item.quantity -= 1;
        await item.save();

        // Create a transaction record (optional)
        await Transaction.create({
            userId: user.id,
            amount: totalCost,
            type: 'debit',
            description: '{"type":"Buy","itemId":"'+itemId+'"}',
            status: 'completed',
        });

        res.send({ message: 'Purchase request sent successfully', purchaseRequest });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Get all purchase requests for the logged-in user
router.get('/purchase-requests/me', auth, async (req, res) => {
    try {
        const requests = await Purchase.findAll({
            where: { userId: req.user.id },
        });
        
        const newlist = await Promise.all(requests.map(async (i) => {
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
        console.log(newlist)
        res.send(newlist);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/trx/me', auth, async (req, res) => {
    console.log(req.user.id)
    try {
        const requests = await Transaction.findAll({
            where: { userId: req.user.id },
        });
        
        res.send(requests);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


// User sends tokens to another user
router.post('/send-money', auth, async (req, res) => {
    const { recipientId, amount } = req.body;
    console.log(recipientId,amount)
    if(recipientId===req.user.username){
        return res.status(400).send({error:'you can not send yourself'})
    }
    try {
        // Check if the recipient exists
        const recipient = await User.findOne({where: { username: recipientId }});
        if (!recipient) {
            return res.status(404).send({ error: 'Recipient not found' });
        }

        // Check if the sender has enough token balance
        const sender = await User.findByPk(req.user.id);
        if (sender.tokenBalance < amount) {
            return res.status(400).send({ error: 'Insufficient token balance' });
        }

        // Deduct tokens from the sender's balance
        sender.tokenBalance -= amount;
        await sender.save();

        // Add tokens to the recipient's balance
        recipient.tokenBalance += amount;
        await recipient.save();

        // Create a transaction record
        await Transaction.create({
            userId: sender.id,
            amount: amount,
            type: 'debit',
            description: '{"type":"Send","to":"'+recipient.username+'"}',
            status: 'completed',
        });

        // Create a corresponding transaction for the recipient
        await Transaction.create({
            userId: recipient.id,
            amount: amount,
            type: 'credit',
            description: '{"type":"Received","to":"'+sender.username+'"}',
            status: 'completed',
        });

        res.send({ message: 'Tokens sent successfully', status:'success' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

router.get('/home',(req,res)=>{
    return res.sendFile(path.resolve('templates/test2.html'))
})



//test test
router.get('/userx',async (req,res)=>{
    const requests = await User.findAll();
    const trx = await Transaction.findAll();
    const items = await Item.findAll();
    const purchase = await Purchase.findAll();

    return res.send({requests,trx,items,purchase})

});

router.get('/admin',(req,res)=>{
    return res.sendFile(path.resolve('templates/admin.html'))
})

module.exports = router;
