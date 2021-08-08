import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { IPost } from "./post.model";
import { PostsService } from "./posts.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Array<IPost> | [] = [];
  isFetching: boolean = false;
  error = null;
  private errorSub: Subscription;

  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.isFetching = true;

    this.errorSub = this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );

    this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
  }

  onCreatePost(postData: IPost) {
    this.postService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;

    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
