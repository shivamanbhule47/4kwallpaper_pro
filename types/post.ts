export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  coverImage?: string;
  content: string;
  readingTime: number;
  featured?: boolean;
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}
