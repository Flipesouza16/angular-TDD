import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpPostParams } from "src/data/protocols/http/http-post-client";

@Injectable({
  providedIn: 'root',
})

export class HttpClientService {

  constructor(private http: HttpClient) {}

  post(params: HttpPostParams<any>): Observable<any> {
    return this.http.post(params.url, params.body);
  }
}
