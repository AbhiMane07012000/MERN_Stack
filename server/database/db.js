const  mongoose = require('mongoose')

const connectDB = async() =>{

    try {
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
            console.log('MongoDb is Connected');
        })
    } catch (error) {
        console.log('error',error);
    }
}

module.exports = connectDB