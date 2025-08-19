import mongoose from 'mongoose'

const connectDB = async () =>{

    mongoose.connection.on('connected',() =>{
        console.log('Mongodb connected')
    })

    // Use default MongoDB URI if not set in environment
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    await mongoose.connect(`${mongoUri}/inkdapper`)
}

export default connectDB