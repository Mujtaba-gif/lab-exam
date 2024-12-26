const mongoose = require('mongoose');

// Create the schema for the Author model
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,  // Regex to match a valid email
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/,  // Regex to match a valid 10-digit phone number
    }
});

// Add a virtual field to count the number of books an author is linked to
authorSchema.virtual('bookCount').get(function () {
    return this.books ? this.books.length : 0;
});

// Create the Author model
const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
