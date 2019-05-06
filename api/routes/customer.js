/* 
    Route for customer.

    dependencies
    -express
    -./datastore
*/
'use strict';
const express = require('express');
const router = express.Router();
const datastore = require('../../datastore.js');

router.post('/setcustomer', async (req, res, next) => {
    if (!req.body || !req.body.Name || !req.body.Description) {
        return res.sendStatus(400);
    }
    const customer = {
        Name: req.body.Name,
        Description: req.body.Description,
        Created: new Date(),
    };
    //insert into datastore
    await datastore.insertCustomer(customer);
    res.status(200).json({
        message: 'Successfully inserted customer'
    });
});

router.get('/getcustomers', async (req, res, next) => {
    const customers = await datastore.getCustomers();
    res.status(200).send(JSON.stringify(customers));
});

router.get('/getcustomer/:id', async (req, res, next) => {
    if(!req.params.id){
        res.status(400).send('No customer id was supplied');
    }
    var id = req.params.id;
    var customer = await datastore.getCustomer(id);
    if(!customer){ res.status(404).send(`Customer with id ${id} was not found.`);}
    //res.status(200).send(JSON.stringify(customer));
    res.status(200).json(customer);
});

module.exports = router;