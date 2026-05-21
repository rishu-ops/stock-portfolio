export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  category: string;
  summary: string;
  publishedAt: string;
};

export type NewsResponse = {
  articles: NewsArticle[];
  generatedAt: string;
};
