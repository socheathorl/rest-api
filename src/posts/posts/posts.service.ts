import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PostModel } from '../posts.interface';

@Injectable()
export class PostsService {
  private posts: Array<PostModel> = [];
  private readonly logger = new Logger(PostsService.name);

  public findAll(): Array<PostModel> {
    this.logger.log('Returning all posts');
    return this.posts;
  }

  public findOne(id: number): PostModel {
    this.logger.log('Returning single post');
    const post: PostModel = this.posts.find((p) => p.id === id);
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  public create(post: PostModel): PostModel {
    this.logger.log('Create new post');
    const titleExists: boolean = this.posts.some(
      (item) => item.title === post.title,
    );

    if (titleExists) {
      throw new UnprocessableEntityException('Post title already exist.');
    }

    const maxId: number = Math.max(...this.posts.map((post) => post.id), 0);
    const id: number = maxId + 1;

    const blogPosts: PostModel = {
      ...post,
      id,
    };

    this.posts.push(blogPosts);

    return blogPosts;
  }

  public delete(id: number): void {
    this.logger.log(`Deleting post with id: ${id}`);
    const index: number = this.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new NotFoundException('Post not found.');
    }

    this.posts.splice(index, 1);
  }

  public update(id: number, post: PostModel): PostModel {
    this.logger.log(`Updating post with id: ${id}`);
    const index: number = this.posts.findIndex((post) => post.id === id);

    if (index === -1) {
      throw new NotFoundException('Post not found.');
    }

    const titleExists: boolean = this.posts.some(
      (item) => item.title === post.title && item.id !== id,
    );

    if (titleExists) {
      throw new UnprocessableEntityException('Post title already exists.');
    }

    const blogPosts: PostModel = {
      ...post,
      id,
    };

    this.posts[index] = blogPosts;

    return blogPosts;
  }
}
