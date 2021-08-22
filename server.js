const express = require('express');
const authRoutes = require('./src/Routes/authRoutes');
const assessmentRoutes = require('./src/Routes/assessmentRoutes')
require('dotenv').config()
// const authRequire = require('./src/Middleware/authRequire');

const port = process.env.PORT;


const app = express();


app.use(express.json());
app.use(authRoutes);
app.use(assessmentRoutes);



app.get('/', (req,res) => {
    res.send('Hi Lucky');
})

app.listen(port || 3306, () => {
    console.log(`Listening to Port`);
});

// server.keepAliveTimeout = 61 * 1000;