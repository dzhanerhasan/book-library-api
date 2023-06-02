# Book Library API

This is a simple REST API for a book library. The API allows you to create, read, update, and delete books and users. It also allows users to borrow books, and add reviews to books.

## Table of Contents

- [Book Library API](#book-library-api)
  - [Table of Contents](#table-of-contents)
  - [Technologies](#technologies)
  - [Setup](#setup)
    - [Configuration](#configuration)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)

## Technologies

This project is created with:

- Node.js
- Express.js
- MongoDB
- Mongoose
- Swagger

## Setup

### Configuration

Create a `.env` file in the root directory of the project, and add the following lines:

```bash
MONGO_URI=<your_mongodb_uri>
```

Replace `<your_mongodb_uri>` with your actual MongoDB URI.

### Installation

Install the dependencies with:

```bash
npm install
```

### Usage

Start the server with:

```bash
npm start
```

The server runs on `http://localhost:5000/` by default.

### Testing

Navigate to `http://localhost:5000/api-docs` in your web browser to view the Swagger UI. You can use this UI to test the API endpoints.
