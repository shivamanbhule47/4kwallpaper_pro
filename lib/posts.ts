import matter from 'gray-matter';
import { Post } from '@/types/post';
import { calculateReadingTime, slugify } from './utils';

export function parsePost(filename: string, rawContent: string): Post {
  const { data, content } = matter(rawContent);
  
  const slug = data.slug || slugify(filename.replace(/\.mdx?$/, ''));
  const title = data.title || filename.replace(/\.mdx?$/, '');
  const date = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
  const excerpt = data.excerpt || content.slice(0, 200).replace(/#|\*|`/g, '').trim() + '...';
  const category = data.category || 'General';
  const coverImage = data.coverImage || null;
  const featured = data.featured === true;

  return {
    slug,
    title,
    excerpt,
    date,
    category,
    coverImage,
    content,
    readingTime: calculateReadingTime(content),
    featured,
  };
}
