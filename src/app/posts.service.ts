import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from "@angular/common/http";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { IPost } from "./post.model";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: IPost = { title, content };

    this.http
      .post<{ name: string }>(
        "https://angular-http-bafe2-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        postData,
        {
          // Default value:
          // observe: "body",
          // Get full response:
          observe: "response",
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    // If you want to add many query params
    // You should use this:
    // let searchParams = new HttpParams();
    // searchParams = searchParams.append('another-custom-param', "test");

    return this.http
      .get<{ [key: string]: IPost }>(
        "https://angular-http-bafe2-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        {
          headers: new HttpHeaders({
            "Custom-Header": "Hello",
          }),
          params: new HttpParams().set("print", "pretty"),
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Array<IPost> = [];

          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({
                ...responseData[key],
                id: key,
              });
            }
          }

          return postsArray;
        }),
        catchError((errorResponse) => {
          return throwError(errorResponse);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete(
        "https://angular-http-bafe2-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        {
          observe: "events",
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);

          if (event.type === HttpEventType.Sent) {
            // If you need to inform user about sending request
          }
          if (event.type === HttpEventType.Response) console.log(event.body);
        })
      );
  }
}
