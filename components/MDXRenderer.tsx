import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import Link from 'next/link';

const components = {
  h1: (props: any) => <h1 className="text-3xl md:text-4xl font-bold mt-16 mb-6 text-white" {...props} />,
  h2: (props: any) => <h2 className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-white" {...props} />,
  h3: (props: any) => <h3 className="text-xl md:text-2xl font-semibold mt-10 mb-3 text-white" {...props} />,
  p: (props: any) => <p className="text-base md:text-lg text-textSecondary leading-[1.8] mb-6" {...props} />,
  a: (props: any) => <Link className="text-accent hover:underline underline-offset-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-6 text-textSecondary space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-6 text-textSecondary space-y-2" {...props} />,
  li: (props: any) => <li className="text-base md:text-lg leading-relaxed" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-2 border-accent pl-6 my-8 italic text-textSecondary text-lg" {...props} />
  ),
  code: (props: any) => {
    const { className, children } = props;
    const isInline = !className;
    return isInline ? (
      <code className="px-1.5 py-0.5 rounded bg-surfaceHighlight text-accent text-sm font-mono" {...props} />
    ) : (
      <code className={className} {...props} />
    );
  },
  pre: (props: any) => (
    <pre className="overflow-x-auto rounded-xl my-8 bg-[#0a0a0a] border border-border" {...props} />
  ),
  img: (props: any) => (
    <Image
      src={props.src}
      alt={props.alt || ''}
      width={800}
      height={500}
      className="rounded-xl my-8 w-full object-cover"
    />
  ),
  hr: () => <hr className="my-12 border-border" />,
  strong: (props: any) => <strong className="text-white font-semibold" {...props} />,
  table: (props: any) => (
    <div className="overflow-x-auto my-8">
      <table className="w-full text-sm text-left text-textSecondary border border-border rounded-xl" {...props} />
    </div>
  ),
  th: (props: any) => <th className="px-4 py-3 bg-surfaceHighlight text-white font-medium border-b border-border" {...props} />,
  td: (props: any) => <td className="px-4 py-3 border-b border-border" {...props} />,
};

interface MDXRendererProps {
  content: string;
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  return (
    <MDXRemote
      source={content}
      components={components}
      options={{
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      }}
    />
  );
}
