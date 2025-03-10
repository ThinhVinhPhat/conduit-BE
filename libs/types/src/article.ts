export interface ArticleInterface {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  // favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string;
    image: string;
    // following: boolean;
  };
}

export interface IArticleResponse {
  status: number;
  data?: ArticleInterface | ArticleInterface[];
  message: string;
}
