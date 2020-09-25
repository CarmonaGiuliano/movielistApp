const express = require('express');
const bookListControllers = require('../controllers/bookListControllers');
const fetch = require('node-fetch');
const env = require('dotenv');
const MovieList = require('../models/movieList');


env.config({path: './config/config.env'});


//to create routes
const router = express.Router();



router.delete('/movie/:name', async (req, res) =>{

    var movieDeleted = req.params.name;
    var index;
    var list = await MovieList.findOne({user: req.user.id})
    list.moviesTitles.forEach((movie)=>{
    if(movie.title == req.params.name.slice(1)){
      index = list.moviesTitles.indexOf(movie)
    }
    });
    list.moviesTitles.splice(index,1)
    await list.save()
    res.json({titleDeleted: movieDeleted});

});

router.get('/movie', async(req, res, next)=>{
  try{
  //I'm sending data to my ejs file and re-render it as well
  if(req.user !== undefined){
      
      var exists = await MovieList.exists({user:req.user.id})
      if(!exists){
         movieList = new MovieList({
         user: req.user.id
        });
       await movieList.save()
     }
      var movies = await MovieList.findOne({user: req.user.id})
      var user = req.user.name
      //console.log(movies.moviesTitles)
      res.render('moviesPage', {movies, user})
   

  }else
  throw new Error('You only can reach this url if you are logged in')   
  
}catch(err){
  next(err)
 }
});



router.post('/movie', async (req, res, next) =>{

 
  var query = req.body.title
  var api_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${query}`
  
     
 try{       
     
      var fetch_response = await fetch(api_url);
      var json = await fetch_response.json();
      var myResults =[];
      var data =[];
      var results = json.results
      //asserting there is results,otherwise it means the title searched was a crap
      if(json.total_results !== 0){

        results.forEach((result) => {
             myResults.push(result.original_title);
      });
       //the algorithm of this api always returns the first result as the best result of my request
       //the filter is made at api, then, I don't need to filter again
         
         data.push(myResults[0]);

         
         var list = await MovieList.findOne({user: req.user.id})
         data.forEach((movieTitle)=>{
          list.moviesTitles.push({title: movieTitle})
         })
         await list.save()
         
         res.json(list);

    }else{

        throw new Error('There is no movie matching with this name');
        
    }


 }catch(err){
  next(err)
 }
  
});



router.get('/movie/information', async(req, res, next)=>{

    var query = req.query.search;
    
try{

    if(req.user !== undefined){
    var api_url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${query}`   

    
          var fetch_response = await fetch(api_url);
          var json = await fetch_response.json();
          var movie = new Object();
          var myResults =[];
          var results = json.results;
    
          //asserting there is results,otherwise it means the title searched was a crap
    
            if(json.total_results !== 0){
    
               results.forEach((result) => {
                   myResults.push(result);
                });
             //the algorithm of this api always returns the first result as the best result of my request
             //the filter is made at api, then, I don't need to filter again
             movie.title = myResults[0].original_title
             movie.id = myResults[0].id
             
    
          }else{
    
             throw new Error('There is no movie matching with this name');
            
         }
    
           api_url = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.API_KEY}&language=en-US`
    
           fetch_response = await fetch(api_url)
           json = await fetch_response.json()
    
           movie.runtime = json.runtime
           movie.release_date = json.release_date
           movie.original_language = json.original_language
           movie.rating = json.vote_average
           movie.status = json.status
           movie.production_companies = [];
    
           json.production_companies.forEach((companie) =>{
              movie.production_companies.push(companie.name)
           });
    
           movie.overview = json.overview
    
    
           api_url = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${process.env.API_KEY}&language=en-US`
    
           fetch_response = await fetch(api_url)
           json = await fetch_response.json()
    
           movie.cast = [];
          
           json.cast.forEach((actorOrActriz)=>{
             movie.cast.push(actorOrActriz.name)
           });
    
           movie.directing = [];
           movie.writing = [];
           movie.production = [];
    
           json.crew.forEach((personInCharge)=>{
             if(personInCharge.department === 'Directing'){
                movie.directing.push(personInCharge.name)
            }else if(personInCharge.department === 'Writing'){
                movie.writing.push(personInCharge.name)
            }else if(personInCharge.department === 'Production'){
                movie.production.push(personInCharge.name)
            }
           });
                   
    
    res.render('informationMovie', {movie})

   }else
      throw new Error('You only can reach this url if you are logged in')  


}catch(err){  
next(err) 
}
});
   

module.exports = router;