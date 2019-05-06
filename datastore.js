'use strict';
const credentials = require('./My First Project.json');
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
  projectId: "",
  credentials: credentials
});
// The kind for the new entity
const kind = 'Customer';
// The Cloud Datastore key for the new entity
const taskKey = datastore.key([kind]);

/**
 * 
 * @param {cusomer} customer customer object
 */
async function insertCustomer(customer){
  return await datastore.save({
    key: taskKey,
    data: customer,
  });
};
/**
 * returns all customers
 */
async function getCustomers()
{
  var objs = [];
  const query = datastore.createQuery('Customer').order('Created');
  const [customers] = await datastore.runQuery(query);
  customers.forEach(customer => {
    objs.push({Customer: customer[datastore.KEY], Description: customer.Description, Name: customer.Name, Created: customer.Created })
  });
  return objs;
}
/**
 * returns a single customer from entity id/name
 * @param {id} id id of the customer to get 
 */
async function getCustomer(id)
{
  var objs = [];
  const key = datastore.key([kind, datastore.int(id)]);
  const [customer] = await datastore.get(key);
  if(!customer){return objs;}
  objs.push({Customer: customer[datastore.KEY], Description: customer.Description, Name: customer.Name, Created: customer.Created });
  return objs;
}

module.exports.getCustomers = getCustomers;
module.exports.getCustomer = getCustomer;
module.exports.insertCustomer = insertCustomer;
