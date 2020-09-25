const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const env = require('dotenv');
const User = require('../models/users');


env.config({path: './config/config.env'});



//Translating my user object in a format that can be stored in cookies and creating a cookie

passport.serializeUser((user, done) =>{

  done(null, user.id)

});

//Translating my user cookie in a user object and retrieving information

passport.deserializeUser((id, done)=>{
    
    User.findById(id).then((user)=>{
        done(null, user)
    });
});


passport.use(
    new GoogleStrategy({
    //how to setup google's api(options)
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
},
   async (accessToken, refreshToken, profile, done) => {
    
try{  

    // check if the user already exits
    userExists = await User.exists({googleId: profile.id})

    if(userExists){

        User.findOne({googleId: profile.id}).then((currentUser)=>{
          done(null, currentUser)
        });   
      
       
    }else{  

       newUser = new User({
          name: profile.displayName,
          googleId: profile.id
      });
    
      await newUser.save();
      done(null, newUser)

    }


}catch(err){
console.log(err)
} 
    

})
);