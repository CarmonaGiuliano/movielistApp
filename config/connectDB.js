const mongoose = require('mongoose');


connectDB = async () =>{
    try {

      var connect = await mongoose.connect(process.env.MONGO_URI, 
        { useNewUrlParser: true, 
          useUnifiedTopology: true,
          useFindAndModify: false, 
        })
      
        console.log(`MongoDb connected at ${connect.connection.host}`);

       return true;
        
    } catch (error) {

        console.log(error)
        process.exit(1)
        
    }

     
}

module.exports = connectDB