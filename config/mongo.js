const mongoose = require('mongoose')

async function connect() {
    try {
        await mongoose.connect('mongodb+srv://starnhan:Starnhan123@cluster0.f2ufa.mongodb.net/FinalProject?retryWrites=true&w=majority');
        console.log("connect successfully")
    } catch (error) {
        console.log("connect failed")
    }
}
module.exports = {connect}