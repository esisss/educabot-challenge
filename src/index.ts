import cors from "cors";
import express from "express";
import MetricsHandler from "./handlers/metrics.ts";
import MetricsService from "./services/metricsService.ts";
import BooksProvider from "./repositories/booksProvider.ts";

const BOOKS_API_URL = 'https://6781684b85151f714b0aa5db.mockapi.io/api/v1/books';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const booksProvider = BooksProvider(BOOKS_API_URL);
const metricsService = MetricsService(booksProvider);
const metricsHandler = MetricsHandler(metricsService);
app.get("/", metricsHandler.get);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app };
