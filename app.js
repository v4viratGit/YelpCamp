//REQUIRED ENTITIES
const express       = require("express"),
      ejs           = require("ejs"),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      flash         = require("connect-flash"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeddb"),
      app           = express(),
      expressSession= require("express-session"),
      passport      = require("passport"),
      passportLocal = require("passport-local"),
      methodOverride= require("method-override"),
      passportLocalMongoose = require("passport-local-mongoose");
      

//REQUIRED ROUTES
const indexRoutes       =   require("./routes/index"),
      campgroundRoutes  =   require("./routes/campground"),
      commentRoutes     =   require("./routes/comment");

      //seedDB();
//MongoDB/Mongoose CONFIGURATION FOR LOCAL DB
//mongoose.connect('mongodb://localhost/yelpcamp', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify:false });

//MongoDB/Mongoose CONFIGURATION FOR DB using Enviroment variable(for local and cloud DB)
mongoose.connect(process.env.DATABASEURL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify:false });

//BODYPARSER CONFIG
app.use(bodyParser.urlencoded({ extended: true }));

//EJS CONFIGURATION
app.set('view engine', 'ejs');

//FOR STATIC FILES

app.use(express.static(__dirname + "/public"));

//method-override CONFIGURATION
app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(expressSession({
    secret: "Yelpcamp session secret",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//HOLD INFO OF LOGGED IN USER AND RUN IT AS A MIDDLEWARE FOR ALL PAGES
//HOLD CONNECT FLASH MESSAGES
app.use(function (req,res,next) {
   res.locals.currentUser=req.user;
   res.locals.errmsg=req.flash("error");
   res.locals.scsmsg=req.flash("success");
   next(); 
});

//EXPRESS ROUTER 
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

//APP CONNECTION TO THE SERVER 3000 FOR LOCAL AND ENVIROMENT VARIABLE FOR HEROKU
const port = process.env.PORT || 3000;
app.listen(port, function () {  
    console.log("Server Has Started!");
  });
  