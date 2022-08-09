import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, tap } from "rxjs";
import { Response } from "express";

@Injectable()
export class FingerprintCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const response: Response = ctx.getContext().req.res;
    return next.handle().pipe(
      tap(data => {
        response.cookie('fingerprint', data.fingerprint, {
          httpOnly: true,
          path: '/',
          signed: true
        });
      }),
    );
  }
}