const mongoose = require('mongoose');
const mongodbkey = require('./app.js').mongodbkey;

module.exports = async (callback) => {
    try {
        await mongoose.connect(mongodbkey, {});
        if (typeof callback === 'function') {
            callback(); //start the program in app.js
        }
    } catch (error) {
        console.error('COULD NOT CONNECT TO DATABASE:', error.message);
    }
};