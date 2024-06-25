import {  Injectable,NestMiddleware } from "@nestjs/common";
import { createProxyMiddleware } from "http-proxy-middleware";


@Injectable()
export class ReverseProxyAuthMiddleware implements NestMiddleware {

      private proxy = createProxyMiddleware({
            target: "http://localhost:3000/api/v1",
            pathRewrite: {
                  '/api/v1/auth-service': '/'
            },
            secure:false,
            onProxyReq: (proxyReq, req: Request, res: Response) => {
                  console.log(proxyReq);
                  console.log(`[NestMiddleware]: Proxing ${req.method} request originally made to '${req.originalUrl}' ..`);
                },
      })
      constructor() {

      }
      use(req:any, res:any, next: (error? : any) => void) {
            this.proxy(req, res, next);
      }
}