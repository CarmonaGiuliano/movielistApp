const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const MovieSchema = new Schema({

    title: {
       type: String,
    },

    releaseYear:{
        type: Number,
        
    }
});



const MovieListSchema = new Schema({

      moviesTitles:[MovieSchema],

      user: {
          type: Schema.Types.ObjectId,
      }

       //to create an id to the data when some event occurs, likewise data is stored or updated, we will use a timestamp
    
      },  {timestamps: true});


      /*when I communicate with a DB in future, it will pluralize the name movie and search 
      for a collection with this name pluralized (or mongoose just will create a collection with this name).*/

const MovieList = mongoose.model('MovieList', MovieListSchema);

module.exports = MovieList;