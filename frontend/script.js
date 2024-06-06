document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('bookList');
    const addBookButton = document.getElementById('addBookButton');
    const bookTitleInput = document.getElementById('bookTitle');
  
    const fetchBooks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/books');
            const books = await response.json();
            bookList.innerHTML = '';
            books.forEach(book => {
                const li = document.createElement('li');
                li.textContent = book.title;
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.setAttribute('class', 'btn btn-outline-danger')
                deleteButton.onclick = async (event) => {
                    event.stopPropagation();
                    await deleteBook(book.id);
                };
                li.appendChild(deleteButton);
                bookList.appendChild(li);
            });
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };
  
    const addBook = async () => {
        const bookTitle = bookTitleInput.value.trim();
        if (!bookTitle) {
            alert('Please enter a book title');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: bookTitle })
            });
            if (response.ok) {
                fetchBooks();
                bookTitleInput.value = '';
            } else {
                console.error('Error adding book:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };
  
    const deleteBook = async (bookId) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/books/${bookId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchBooks();
            } else {
                console.error('Error deleting book:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };
  
    addBookButton.addEventListener('click', addBook);
    fetchBooks();
  });
  