const mongoose = require("mongoose");

const workSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    siteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sites',
        required: true
    }
})

const WorkModel = mongoose.model("Works", workSchema)
module.exports = WorkModel;