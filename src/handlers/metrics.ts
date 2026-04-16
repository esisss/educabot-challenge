import { Request, Response } from 'express'
import { ErrorResponse, MetricsResponse } from '../models/metrics.ts'
import { MetricsService } from '../services/metricsService.ts'

interface GetMetricsQuery {
  author?: string
}

const metricsHandler = (service: MetricsService) => {
  const get = async (
    req: Request<{}, {}, {}, GetMetricsQuery>,
    res: Response<MetricsResponse | ErrorResponse>
  ) => {
    try {
      const { author } = req.query
      const metrics = await service.getMetrics(author)

      res.status(200).json(metrics)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unexpected error'
      console.error('Failed to get metrics', error)
      res.status(500).json({ error: message })
    }
  }

  return {
    get,
  }
}

export default metricsHandler
