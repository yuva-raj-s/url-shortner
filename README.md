# URL Shortener

A modern URL shortener service built with TypeScript, Express, and MongoDB. This service allows you to create shortened URLs that redirect to your original long URLs.

## Features

- Create short, memorable URLs from long URLs
- Automatic URL validation
- MongoDB for persistent storage
- Redis for caching
- TypeScript for type safety
- Express.js for the backend server
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Redis
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd url-shortner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
```

## Usage

1. Start the development server:
```bash
npm start
```

2. The server will start running on `http://localhost:3000` (or the port specified in your .env file)

## API Endpoints

- `POST /api/url` - Create a new shortened URL
- `GET /:shortId` - Redirect to the original URL

## Technologies Used

- TypeScript
- Express.js
- MongoDB
- Redis
- Zod (for validation)
- Axios
- CORS
- dotenv

## Development

The project uses TypeScript for type safety and better development experience. The main server file is located at `src/server.ts`.

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

