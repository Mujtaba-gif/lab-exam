const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    membershipActive: { type: Boolean, required: true },
    membershipType: { type: String, enum: ['standard', 'premium'], required: true },
});

module.exports = mongoose.model('Borrower', borrowerSchema);
