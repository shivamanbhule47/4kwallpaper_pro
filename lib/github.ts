import { Post, GitHubFile } from '@/types/post';

const OWNER = process.env.GITHUB_OWNER!;
const REPO = process.env.GITHUB_REPO!;
const TOKEN = process.env.GITHUB_TOKEN;
const POSTS_DIR = process.env.GITHUB_POSTS_DIR || 'posts';

const headers: Record<string, string> = {
  Accept: 'application/vnd.github.v3+json',
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

async function fetchGitHubAPI(path: string) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;
  const res = await fetch(url, { headers, next: { revalidate: 60 } });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`GitHub API error: ${res.status}`);
  }
  
  return res.json();
}

async function fetchFileContent(downloadUrl: string): Promise<string> {
  const res = await fetch(downloadUrl, { 
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    next: { revalidate: 60 }
  });
  
  if (!res.ok) throw new Error('Failed to fetch file content');
  return res.text();
}

export async function getAllPosts(): Promise<<Post[]> {
  const files = await fetchGitHubAPI(POSTS_DIR) as GitHubFile[] | null;
  
  if (!files || !Array.isArray(files)) return [];

  const markdownFiles = files.filter(
    (f) => f.type === 'file' && (f.name.endsWith('.md') || f.name.endsWith('.mdx'))
  );

  const posts = await Promise.all(
    markdownFiles.map(async (file) => {
      try {
        const content = await fetchFileContent(file.download_url);
        const { parsePost } = await import('./posts');
        return parsePost(file.name, content);
      } catch {
        return null;
      }
    })
  );

  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
