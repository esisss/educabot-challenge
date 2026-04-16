import { describe, it, expect, vi, beforeEach } from 'vitest'
import metricsHandler from './metrics'
import { Request, Response } from 'express'
import { ErrorResponse, MetricsResponse } from '../models/metrics'
import { MetricsService } from '../services/metricsService'

describe('metricsHandler', () => {
  const mockMetrics: MetricsResponse = {
    mean_units_sold: 200,
    cheapest_book: { id: 2, name: 'Book 2', author: 'Author 2', units_sold: 200, price: 15 },
    books_written_by_author: [],
  }

  const mockMetricsService: MetricsService = {
    getMetrics: vi.fn().mockResolvedValue(mockMetrics),
  }

  const handler = metricsHandler(mockMetricsService)

  let mockReq: Request<{}, {}, {}, { author?: string }>
  let mockRes: Response<MetricsResponse | ErrorResponse>
  let jsonMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    jsonMock = vi.fn()
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: jsonMock,
    } as unknown as Response<MetricsResponse | ErrorResponse>

    mockReq = {
      query: {},
    } as Request<{}, {}, {}, { author?: string }>

    vi.clearAllMocks()
    vi.mocked(mockMetricsService.getMetrics).mockResolvedValue(mockMetrics)
  })

  describe('get', () => {
    it('should return metrics with empty author query', async () => {
      await handler.get(mockReq, mockRes)

      expect(mockMetricsService.getMetrics).toHaveBeenCalledWith(undefined)
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith(mockMetrics)
    })

    it('should return metrics with author query', async () => {
      mockReq.query = { author: 'Author 1' }

      const metricsByAuthor: MetricsResponse = {
        ...mockMetrics,
        books_written_by_author: [
          { id: 1, name: 'Book 1', author: 'Author 1', units_sold: 100, price: 20 },
          { id: 3, name: 'Book 3', author: 'Author 1', units_sold: 300, price: 25 },
        ],
      }
      vi.mocked(mockMetricsService.getMetrics).mockResolvedValue(metricsByAuthor)

      await handler.get(mockReq, mockRes)

      expect(mockMetricsService.getMetrics).toHaveBeenCalledWith('Author 1')
      expect(mockRes.status).toHaveBeenCalledWith(200)
      expect(jsonMock).toHaveBeenCalledWith(metricsByAuthor)
    })

    it('should return 500 when service throws', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
      vi.mocked(mockMetricsService.getMetrics).mockRejectedValue(new Error('Provider failed'))

      await handler.get(mockReq, mockRes)

      expect(mockRes.status).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Provider failed' })
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
