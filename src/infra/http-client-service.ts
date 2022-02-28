import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { HttpPostClient, HttpPostParams } from "src/data/protocols/http/http-post-client";
import { HttpResponse } from "src/data/protocols/http/http-response";

@Injectable({
  providedIn: 'root',
})

export class HttpClientService implements HttpPostClient<any, any> {

  constructor(private http: HttpClient) {}

  post(params: HttpPostParams<any>): Promise<HttpResponse<any>> {
    return new Promise(resolve => {
      this.http.post(params.url, params.body).subscribe((data: any) => {
        resolve({
          statusCode: data.status,
          body: data
        });
      })
    })
  }
}
