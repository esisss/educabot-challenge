import { Book } from './book.ts'

export interface MetricsResponse {
  mean_units_sold: number
  cheapest_book: Book | null
  books_written_by_author: Book[]
}

export interface ErrorResponse {
  error: string
}
