const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const auth = require('./middleware/auth');
const admincheck = require('./middleware/admincheck');


dotenv.config();

const app = express();
app.use(express.json());

sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((error) => {
    console.error('Error syncing database:', error);
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/admin', admincheck, adminRoutes);


app.listen(3000, () => {
    console.log('Server running on port 3000');
});
