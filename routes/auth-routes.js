const express = require('express');
const passport = require('passport');

authRouter = express.Router();

authRouter.get('/login', (req, res) =>{
    res.send('logging in...');
})

authRouter.get('/google', passport.authenticate('google',{
    scope: ['profile']
}));

// callback route for google to redirect to

authRouter.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    
    res.redirect('/profile/movie')
});

authRouter.get('/logout', (req, res) =>{
req.logout()
res.redirect('/')

});

module.exports = authRouter;
