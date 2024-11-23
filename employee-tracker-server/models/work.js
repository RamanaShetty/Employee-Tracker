const mongoose = require("mongoose");

const workSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Site',
        required: true
    }
})

const WorkModel = mongoose.model("Works", workSchema)
module.exports = WorkModel;