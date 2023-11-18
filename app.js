const path = require("path");
const express = require("express");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb'); // Add this line to import ObjectId

const app = express();
const port = "8080";

mongoose.connect("mongodb://127.0.0.1:27017/appdbs", { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const Preferences = require("./models/Preferences");
const Liked = require("./models/Liked");
const Recommended = require("./models/Recommended");
const Top = require("./models/Top");
const Images = require("./models/Images")

var userImages;
var topStations;
var favoriteStations;
var recStations;
var likedStations;

const info = {
    userImages : userImages,
    stationimages : userImages,
    topStations : topStations,
    favoriteStations : favoriteStations,
    recStations : recStations
}

const info2 = {
    likedStations : likedStations
}

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
    try {
        const dbo = db;

        // Fetch user images
        const userImages = await dbo.collection("userImages").findOne({ _id: new ObjectId("6558bea1c7a4a9ad5eb05ff4") });

        // Fetch top stations
        const topStations = await dbo.collection("topstations").find({}).toArray();

        // Fetch favorite stations
        const favoriteStations = await dbo.collection("favoritestations").find({}).toArray();

        // Fetch recommended stations
        const recStations = await dbo.collection("recstations").find({}).toArray();

        res.render("home.ejs", {
            userImages,
            topStations,
            favoriteStations,
            recStations
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
// const information = new Preferences(req.body)
    // information.save((error, savedUser) => {
    //     if(error){
    //         throw error;
    //     } 
    //     res.json(savedUser);
    // })
    app.post("/api/preference/:id", async function (req, res) {
        try {
            const preferenceId = req.params.id;
    
            // Extract updated preference data from the request body
            const {
                genre,
                language,
                autoplay,
                explicit,
                audioQuality,
                social,
                playback,
                window,
                storage
            } = req.body;
    
            // Create an object with the updated data
            const updatedPreference = {
                genre,
                language,
                autoplay: Boolean(autoplay),
                explicit: Boolean(explicit),
                audioQuality,
                social,
                playback,
                window,
                storage
            };
    
            // Find the document by _id and replace it with the updated data
            const replacedPreference = await Preferences.findOneAndReplace(
                { _id: new ObjectId(preferenceId) },
                updatedPreference,
                { new: true } // Return the modified document
            );
    
            if (!replacedPreference) {
                return res.status(404).json({ error: 'Preference not found' });
            }
    
            // Render the updated view with the replacedPreference
            res.render("preferences.ejs", { updatedPreference });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    

app.get("/likes", async function (req, res) {
    try {
        const dbo = db;

        // Fetch user images
        const userImages = await dbo.collection("userImages").findOne({ _id: new ObjectId("6558bea1c7a4a9ad5eb05ff4") });

        // Fetch top stations
        const topStations = await dbo.collection("topstations").find({}).toArray();

        // Fetch favorite stations
        const favoriteStations = await dbo.collection("favoritestations").find({}).toArray();

        // Fetch recommended stations
        const recStations = await dbo.collection("recstations").find({}).toArray();

        const likedStations = await dbo.collection("likedstations").find({}).toArray();

        res.render("likes.ejs", {
            userImages,
            topStations,
            favoriteStations,
            recStations,
            likedStations
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/preferences/:id", async function (req, res) {
    try {
        // Extract preference data based on the provided ID
        const preferenceId = req.params.id;

        // Fetch preference data from the database based on the ID
        const updatedPreference = await Preferences.findById(preferenceId);

        // Render the preferences.ejs template with the fetched data
        res.render("preferences.ejs", { updatedPreference });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/recommendations", async function (req, res) {
    try {
        const dbo = db;

        // Fetch user images
        const userImages = await dbo.collection("userImages").findOne({ _id: new ObjectId("6558bea1c7a4a9ad5eb05ff4") });

        // Fetch top stations
        const topStations = await dbo.collection("topstations").find({}).toArray();

        // Fetch favorite stations
        const favoriteStations = await dbo.collection("favoritestations").find({}).toArray();

        // Fetch recommended stations
        const recStations = await dbo.collection("recstations").find({}).toArray();

        const likedStations = await dbo.collection("likedstations").find({}).toArray();

        res.render("recommended.ejs", {
            userImages,
            topStations,
            favoriteStations,
            recStations,
            likedStations
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/station", function (req, res) {
    res.render("station.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})