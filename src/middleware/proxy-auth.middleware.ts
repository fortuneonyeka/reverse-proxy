import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware, Options, RequestHandler } from 'http-proxy-middleware';
import { logger } from '../logger';

// Extend the Options interface to include custom properties
interface CustomProxyOptions extends Options {
  onError?: (err: any, req: Request, res: Response) => void;
  onProxyReq?: (proxyReq: any, req: Request, res: Response) => void;
  onProxyRes?: (proxyRes: any, req: Request, res: Response) => void;
}

@Injectable()
export class ReverseProxyAuthMiddleware implements NestMiddleware {
  private createProxyMiddleware(options: CustomProxyOptions): RequestHandler {
    return createProxyMiddleware(options);
  }

  private proxy = this.createProxyMiddleware({
    target: process.env.TARGET_SERVER,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      const rewrittenPath = path.replace(/^\/api\/v1\/auth-service/, '');
      logger.info(`Path rewrite: ${path} -> ${rewrittenPath}`);
      return rewrittenPath;
    },
    onError: (err, req, res) => {
      logger.error(`Proxy error: ${err.message}`);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    },
    // onProxyReq: (proxyReq, req, res) => {
    //   logger.info(`Proxying request: ${req.method} ${req.originalUrl}`);
    //   console.log(proxyReq);
    //         // console.log(`[NestMiddleware]: Proxing ${req.method} request originally made to '${req.originalUrl}' ..`);
      
    // },
    // onProxyRes: (proxyRes, req, res) => {
    //   logger.info(`Received response for: ${req.method} ${req.originalUrl} - ${proxyRes.statusCode}`);
      
    // },
  });

  use(req: Request, res: Response, next: NextFunction) {
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');

    this.proxy(req, res, next);
  }
}
