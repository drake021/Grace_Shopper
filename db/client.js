// build and export your unconnected client here

const { Client } = require('pg');
const client = new Client('postgres://localhost:5432/grace_shopper');

module.exports = {
    client
};