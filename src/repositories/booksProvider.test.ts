import axios, { AxiosError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import booksProvider from './booksProvider'
import { Book } from '../models/book'

vi.mock('axios')

describe('booksProvider', () => {
  const apiUrl = 'https://example.com/books'
  const provider = booksProvider(apiUrl)
  const mockedGet = vi.mocked(axios.get)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(axios.isAxiosError).mockImplementation((error: unknown): error is AxiosError => {
      return Boolean((error as { isAxiosError?: boolean }).isAxiosError)
    })
  })

  it('returns books from api response', async () => {
    const books: Book[] = [
      { id: 1, name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
      { id: 2, name: 'Book 2', author: 'Author 2', units_sold: 200, price: 15 },
    ]

    mockedGet.mockResolvedValue({ data: books } as never)

    const result = await provider.getBooks()

    expect(mockedGet).toHaveBeenCalledWith(apiUrl)
    expect(result).toEqual(books)
  })

  it('throws descriptive error for network failures', async () => {
    const networkError = {
      isAxiosError: true,
      message: 'Network Error',
    } as AxiosError

    mockedGet.mockRejectedValue(networkError)

    await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: Network error')
  })

  it('throws descriptive error for non-success status codes', async () => {
    const statusError = {
      isAxiosError: true,
      response: {
        status: 503,
      },
    } as AxiosError

    mockedGet.mockRejectedValue(statusError)

    await expect(provider.getBooks()).rejects.toThrow('Failed to fetch books: API returned status 503')
  })
})
