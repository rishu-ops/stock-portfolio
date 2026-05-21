export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  category: string;
  tagColor: string;
  summary: string;
  publishedAt: string;
  url: string;
};

export type NewsResponse = {
  articles: NewsArticle[];
  generatedAt: string;
};
