import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

import { IPost } from "./post.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts: Array<IPost> | [] = [];
  isFetching: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: IPost) {
    // Send Http request
    this.http
      .post<{ name: string }>(
        "https://angular-http-bafe2-default-rtdb.europe-west1.firebasedatabase.app/posts.json",
        postData
      )
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.isFetching = true;

    this.http
      .get<{ [key: string]: IPost }>(
        "https://angular-http-bafe2-default-rtdb.europe-west1.firebasedatabase.app/posts.json"
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
        })
      )
      .subscribe((posts) => {
        console.log(posts);

        this.isFetching = false;
        this.loadedPosts = posts;
      });
  }
}
