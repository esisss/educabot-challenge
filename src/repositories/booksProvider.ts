import axios from 'axios'
import { Book } from '../models/book.ts'
import { BooksProvider } from '../providers/books.ts'

const booksProvider = (apiUrl: string): BooksProvider => {
  const getBooks = async (): Promise<Book[]> => {
    try {
      const response = await axios.get<Book[]>(apiUrl)
      return response.data
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Failed to fetch books: API returned status ${error.response.status}`)
        }

        throw new Error('Failed to fetch books: Network error')
      }

      throw new Error('Failed to fetch books: Unknown error')
    }
  }

  return {
    getBooks,
  }
}

export default booksProvider
