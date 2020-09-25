var express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/MovieListRoutes');
const authRoutes = require('./routes/auth-routes');
const passportSetup = require('./services/passport-setup');
const passport = require('passport');
const cookieSession = require('cookie-session');
const env = require('dotenv');
const connectDB = require('./config/connectDB');


//load config file

env.config({path: './config/config.env'});


var myapp = express();

//connect to MongoDB Atlas and listening on the env port

connectDB().then((result)=> {
if(result)
myapp.listen(process.env.PORT, ()=> console.log('listening on the port 3000'))
});


/* Saying to express that I'll use ejs as a template.
By default express will search the templates in a folder called views */

myapp.set('view engine', 'ejs');

//servering up static files like CSS, JS, images.

myapp.use('/assets', express.static('assets'));

myapp.use(express.urlencoded({ extended: true }));

myapp.use(cookieSession({
   //cookie expires in one year
   maxAge: 365*24*60*60*1000 ,
   keys: [process.env.COOKIE_KEY]
}));


//initialize passport

myapp.use(passport.initialize());
myapp.use(passport.session());

myapp.get('/', (req, res)=>{
 if(req.user != undefined){
   res.redirect('/profile/movie')
 }
 res.render('homePage')

})


myapp.use('/auth', authRoutes);

myapp.use('/profile', routes);

//myapp.use('/auth', authRoutes);

myapp.use((err, req, res, next) =>{

res.status(404).send(err.message);

});

myapp.use((req, res) => {
    res.status(404).render('404', { title: '404' });
  });

