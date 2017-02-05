﻿import { Injectable }   from '@angular/core';
import { PostRepository }       from './post.repository';
import { Post }                 from '../../models/post';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PostService {
  posts = [] as Post[];
  selectedPost = {} as Post;

  constructor(private postRepository: PostRepository) { }

  init(): Promise<Post[]> {
    return this.getPosts();
  }

  getAll(): Post[] {
    return this.posts;
  }

  getCurrent(): Post {
    return this.selectedPost;
  }

  setCurrent(idUrl: string): Promise<Post> {
    return this.postRepository.get(idUrl, true)
      .then((resp: Post) => {
        this.selectedPost = resp;
        return this.selectedPost;
      });
  }

  create(): Promise<Post> {
    return this.postRepository.create()
      .then((resp: Post) => {
        this.selectedPost = resp;
        this.posts.push(this.selectedPost);
        return this.selectedPost;
      });
  }

  save(): Promise<void> {
    return this.postRepository.save(this.selectedPost)
      .then(() => {
        for (let i = 0; i < this.posts.length; i++) {
          if (this.selectedPost.postId === this.posts[i].postId) {
            this.posts[i] = this.selectedPost;
          }
        }
      });
  }

  remove(idUrl: string): Promise<void> {
    return this.postRepository.remove(idUrl)
      .then(() => {
        this.posts = this.posts.filter((obj: Post) => (obj.url !== idUrl));
        this.setCurrent(this.posts[0].url);
      });
  }

  private getPosts(): Promise<Post[]> {
    return this.postRepository.getAll(false, false, true)
      .then((posts: Post[]) => {
        this.posts = posts;
        return this.postRepository.get(this.posts[0].url, true);
      })
      .then((resp: Post) => {
        this.selectedPost = resp;
        return this.posts;
      });
  }
}