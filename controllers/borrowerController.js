// controllers/borrowerController.js
const mongoose = require('mongoose');
const Book = require('../models/book');
const Borrower = require('../models/borrower');

exports.borrowBook = async (req, res) => {
    const { borrowerId, bookId } = req.body;

    try {
        // Ensure the borrowerId and bookId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(borrowerId) || !mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid borrower or book ID' });
        }

        // Convert to ObjectId and find borrower and book in the database
        const borrower = await Borrower.findById(borrowerId);
        const book = await Book.findById(bookId);

        if (!borrower || !book) {
            return res.status(400).json({ message: 'Invalid borrower or book' });
        }

        // Check if borrower exceeds borrowing limit
        if (borrower.membershipType === 'standard' && borrower.borrowedBooks.length >= 5) {
            return res.status(400).json({ message: 'Standard members can borrow up to 5 books only' });
        }
        if (borrower.membershipType === 'premium' && borrower.borrowedBooks.length >= 10) {
            return res.status(400).json({ message: 'Premium members can borrow up to 10 books only' });
        }

        // Check if the book has enough available copies
        if (book.availableCopies <= 0) {
            return res.status(400).json({ message: 'No available copies for this book' });
        }

        // Borrow the book (decrease available copies)
        book.availableCopies -= 1;
        borrower.borrowedBooks.push(bookId);

        await book.save();
        await borrower.save();

        res.status(200).json({ message: 'Book borrowed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error borrowing book', error: err.message });
    }
};

// Return book logic (optional, if you want it in the same file)
exports.returnBook = async (req, res) => {
    const { borrowerId, bookId } = req.body;

    try {
        const borrower = await Borrower.findById(borrowerId);
        const book = await Book.findById(bookId);

        if (!borrower || !book) {
            return res.status(400).json({ message: 'Invalid borrower or book' });
        }

        // Remove the book from borrowedBooks array
        borrower.borrowedBooks = borrower.borrowedBooks.filter(id => id.toString() !== bookId.toString());

        // Return the book (increase available copies)
        book.availableCopies += 1;

        await book.save();
        await borrower.save();

        res.status(200).json({ message: 'Book returned successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error returning book', error: err.message });
    }
};
