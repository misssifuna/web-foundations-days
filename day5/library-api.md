# Library REST API Design

## Resource

A book is represented by the following fields:

- `id`: Unique identifier for the book.
- `title`: Title of the book.
- `author`: Name of the author.
- `publishedYear`: Year the book was published.

Base path: `/api/books`

## Endpoints

### 1. List all books

- **Method:** GET
- **Path:** `/api/books`
- **Description:** Retrieves a list of all books.
- **Success status:** `200 OK`
- **Request body:** None.

### 2. Get one book

- **Method:** GET
- **Path:** `/api/books/42`
- **Description:** Retrieves the book with ID 42.
- **Success status:** `200 OK`
- **Request body:** None.

### 3. Create a book

- **Method:** POST
- **Path:** `/api/books`
- **Description:** Creates a new book.
- **Success status:** `201 Created`
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

### 4. Update a book

- **Method:** PUT
- **Path:** `/api/books/42`
- **Description:** Replaces the editable details of the book with ID 42.
- **Success status:** `200 OK`
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "publishedYear": 1958
}
```

### 5. Delete a book

- **Method:** DELETE
- **Path:** `/api/books/42`
- **Description:** Deletes the book with ID 42.
- **Success status:** `204 No Content`
- **Request body:** None.

### 6. List books by author

- **Method:** GET
- **Path:** `/api/books?author=Chinua%20Achebe`
- **Description:** Retrieves books written by the specified author.
- **Success status:** `200 OK`
- **Request body:** None.

## Error Responses

### 400 Bad Request

Returned when the request contains invalid data.

Example: A request to create a book includes a `publishedYear` value that is not a valid year.

### 404 Not Found

Returned when the requested resource does not exist.

Example: A request to `GET /api/books/9999` returns 404 because no book has that ID.
