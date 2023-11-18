const mongoose = require('mongoose');
const Preferences = require("./models/Preferences");
const Liked = require("./models/Liked");
const Recommended = require("./models/Recommended");
const Top = require("./models/Top");
const Images = require("./models/Images")

mongoose.connect("mongodb://localhost/appdb");

const Preference = new Preference({ 
    genre: "Pop",
    language: "English",
    autoplay: Boolean,
    explicit: Boolean,
    audioQuality: {
        streamQuality: String,
        download: Boolean,
        adjust: Boolean,
        normalize: Boolean,
        level: Number
    },
    social : {
        facebook: Boolean,
        private: Boolean,
        activity: Boolean,
        recent: Boolean
    },
    playback : {
        crossfade: Boolean,
        automix: Boolean,
        mono: Boolean,
        equalizer : Boolean
    },
    window : {
        auto: Boolean,
        minimize: Boolean
    },
    storage : {
        downloads: Boolean
    }
});
Preferences.save().then( () => console.log("Preferences Saved"));