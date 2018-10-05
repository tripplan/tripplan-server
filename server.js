// server.js
require("dotenv").config()
const _ = require("lodash")
const jsonServer = require("json-server")
const app = jsonServer.create()
const router = jsonServer.router("db.json")
const db = router.db
const middlewares = jsonServer.defaults()

var passport = require("passport")
var Strategy = require("passport-facebook").Strategy

// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(
    new Strategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/login/return"
        },
        function(accessToken, refreshToken, profile, cb) {
            // In this example, the user's Facebook profile is supplied as the user
            // record.  In a production-quality application, the Facebook profile should
            // be associated with a user record in the application's database, which
            // allows for account linking and authentication with other identity
            // providers.
            return cb(null, profile)
        }
    )
)

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
    cb(null, user)
})

passport.deserializeUser(function(obj, cb) {
    cb(null, obj)
})

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("cookie-parser")())
app.use(
    require("express-session")({
        secret: "keyboard cat dsasffs",
        resave: true,
        saveUninitialized: true
    })
)

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize())
app.use(passport.session())

const redirectBack = function(req, res) {
    const url = `${process.env.CLIENT_URL}${req.params.redirect || ""}`
    console.log(url)
    res.redirect(url)
}

const logOut = (req, res, next) => {
    req.logOut()
    next()
}

app.get("/login", passport.authenticate("facebook"), redirectBack)
app.get("/login/return", passport.authenticate("facebook"), redirectBack)

app.use(middlewares)
app.use("/", require("connect-ensure-login").ensureLoggedIn())
app.get("/profile", (req, res) => res.send(req.user))
app.get("/logout", logOut, redirectBack)

app.use("/:collection/:id?", function(req, res, next) {
    const collections = ["trips", "destinations", "notes"]
    const { collection, id } = req.params
    if (collections.includes(collection)) {
        const userId = _.get(req, "user.id", undefined)
        req.query["people_like"] = userId
        if (id) {
            const { people = [] } = db.get(collection).find({id})
            if (people.includes(userId)) {
                next()
            } else {
                res.send("401")
            }
        } else {
            next()
        }
    } else {
        next()
    }
})

app.use(router)

app.listen(3000, () => console.log("Listening 3000"))
