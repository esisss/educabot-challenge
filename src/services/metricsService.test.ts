import { beforeEach, describe, expect, it, vi } from 'vitest'
import metricsService from './metricsService'
import { Book } from '../models/book'
import { BooksProvider } from '../providers/books'

describe('metricsService', () => {
  const mockBooks: Book[] = [
    { id: 1, name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
    { id: 2, name: 'Book 2', author: 'Author 2', units_sold: 200, price: 15 },
    { id: 3, name: 'Book 3', author: 'Author 1', units_sold: 300, price: 25 },
  ]

  const mockBooksProvider: BooksProvider = {
    getBooks: vi.fn(),
  }

  const service = metricsService(mockBooksProvider)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(mockBooksProvider.getBooks).mockResolvedValue(mockBooks)
  })

  it('returns metrics without author filter', async () => {
    const result = await service.getMetrics()

    expect(mockBooksProvider.getBooks).toHaveBeenCalled()
    expect(result).toEqual({
      mean_units_sold: 200,
      cheapest_book: mockBooks[1],
      books_written_by_author: [],
    })
  })

  it('returns metrics with author filter', async () => {
    const result = await service.getMetrics('Author 1')

    expect(mockBooksProvider.getBooks).toHaveBeenCalled()
    expect(result).toEqual({
      mean_units_sold: 200,
      cheapest_book: mockBooks[1],
      books_written_by_author: [mockBooks[0], mockBooks[2]],
    })
  })

  it('returns default values for empty books list', async () => {
    vi.mocked(mockBooksProvider.getBooks).mockResolvedValue([])

    const result = await service.getMetrics('Author 1')

    expect(result).toEqual({
      mean_units_sold: 0,
      cheapest_book: null,
      books_written_by_author: [],
    })
  })

  it('matches author case-insensitively', async () => {
    const result = await service.getMetrics('author 1')

    expect(result.books_written_by_author).toEqual([mockBooks[0], mockBooks[2]])
  })

  it('propagates provider errors', async () => {
    const providerError = new Error('Provider failed')
    vi.mocked(mockBooksProvider.getBooks).mockRejectedValue(providerError)

    await expect(service.getMetrics()).rejects.toThrow('Provider failed')
  })
})
