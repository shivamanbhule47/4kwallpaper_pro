import { Client } from '@notionhq/client';
import { Post } from '@/types/post';
import { calculateReadingTime, formatDate } from './utils';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function getAllPosts(): Promise<<Post[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  });

  return response.results.map((page: any) => {
    const props = page.properties;
    const title = props.Name?.title?.[0]?.plain_text || 'Untitled';
    const slug = props.Slug?.rich_text?.[0]?.plain_text || page.id;
    const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || '';
    const date = props.Date?.date?.start || new Date().toISOString();
    const category = props.Category?.select?.name || 'General';
    const coverImage = props.Cover?.files?.[0]?.file?.url || props.Cover?.files?.[0]?.external?.url || null;
    const content = ''; // Fetch via page.blocks.children.list if needed

    return {
      slug,
      title,
      excerpt,
      date,
      category,
      coverImage,
      content,
      readingTime: calculateReadingTime(excerpt),
      featured: props.Featured?.checkbox || false,
    };
  });
}

export async function getPostBySlug(slug: string): Promise<<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}
