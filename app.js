'use strict';
if (process.env.NODE_ENV === 'production') {
    require('@google-cloud/trace-agent').start();
    require('@google-cloud/debug-agent').start();
}
const express = require('express');
const datastore = require('./datastore');
const logging = require('./logging.js');
const bodyParser = require('body-parser');

const port = process.env.PORT || 8080;
const app = express();


const customerRoutes = require('./api/routes/customer.js');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET');
        return res.status(200).json({});
    }
});
*/
app.use(logging.requestLogger);
app.use('/customer', customerRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status(404);
    next(error);
});
app.use((error, req, res, next) => {
    res.status(500).json({
        error: {
            Message: error.Message
        }
    });
});

const server = app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});



