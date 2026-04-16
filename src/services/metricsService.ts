import { Book } from '../models/book.ts'
import { MetricsResponse } from '../models/metrics.ts'
import { BooksProvider } from '../providers/books.ts'

export type MetricsService = {
  getMetrics: (author?: string) => Promise<MetricsResponse>
}

const metricsService = (booksProvider: BooksProvider): MetricsService => {
  const getMetrics = async (author?: string): Promise<MetricsResponse> => {
    const books = await booksProvider.getBooks()
    const booksWrittenByAuthor = author ? getBooksWrittenByAuthor(books, author) : []

    return {
      mean_units_sold: getMeanUnitsSold(books),
      cheapest_book: getCheapestBook(books),
      books_written_by_author: booksWrittenByAuthor,
    }
  }

  return {
    getMetrics,
  }
}

const getMeanUnitsSold = (books: Book[]): number => {
  if (books.length === 0) {
    return 0
  }

  const totalUnitsSold = books.reduce((sum, book) => sum + book.units_sold, 0)
  return totalUnitsSold / books.length
}

const getCheapestBook = (books: Book[]): Book | null => {
  if (books.length === 0) {
    return null
  }

  return books.reduce((cheapest, book) => {
    return book.price < cheapest.price ? book : cheapest
  }, books[0])
}

const getBooksWrittenByAuthor = (books: Book[], author: string): Book[] => {
  return books.filter((book) => book.author.toLowerCase() === author.toLowerCase())
}

export default metricsService
