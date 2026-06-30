import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewProps {
  title: string;
  content: string;
}

function slugify(text: string): string {
  const polishChars: Record<string, string> = {
    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
    'Ą': 'a', 'Ć': 'c', 'Ę': 'e', 'Ł': 'l', 'Ń': 'n', 'Ó': 'o', 'Ś': 's', 'Ź': 'z', 'Ż': 'z'
  };
  return text
    .split('')
    .map(char => polishChars[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function MarkdownView({ title, content }: MarkdownViewProps) {
  return (
    <div className="animate-fade-in-up w-full">
      <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16 text-left">
        {title}
      </h1>
        <div className="prose prose-[#5C4E43] font-serif prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null, // Hide H1 as we already display it
              h2: ({ node, children, ...props }) => {
                const text = React.Children.toArray(children)
                  .map((child) => (typeof child === 'string' ? child : ''))
                  .join('');
                const id = slugify(text);
                return (
                  <h2
                    id={id}
                    className="text-xl md:text-2xl text-[#2C2119] mt-12 mb-4 font-medium scroll-mt-20 2xl:scroll-mt-36"
                    {...props}
                  >
                    {children}
                  </h2>
                );
              },
              h3: ({ node, ...props }) => (
                <h3
                  className="text-lg md:text-xl text-[#2C2119] mt-8 mb-4 font-medium"
                  {...props}
                />
              ),
              hr: ({ node, ...props }) => (
                <hr className="border-t border-[#E6DCC9] my-12" {...props} />
              ),
              p: ({ node, children, ...props }) => {
                const text = React.Children.toArray(children)
                  .map((child) => (typeof child === 'string' ? child : ''))
                  .join('');

                const plMatch = text.match(/^(Data ostatniej aktualizacji:\s*)(.+)$/i);
                const enMatch = text.match(/^(Last updated:\s*)(.+)$/i);

                if (plMatch) {
                  return (
                    <p className="leading-relaxed mb-6" {...props}>
                      {plMatch[1]}
                      <span className="whitespace-nowrap">{plMatch[2]}</span>
                    </p>
                  );
                }

                if (enMatch) {
                  return (
                    <p className="leading-relaxed mb-6" {...props}>
                      {enMatch[1]}
                      <span className="whitespace-nowrap">{enMatch[2]}</span>
                    </p>
                  );
                }

                return <p className="leading-relaxed mb-6" {...props}>{children}</p>;
              },
              ul: ({ node, ...props }) => (
                <ul
                  className="list-disc list-inside mb-6 space-y-2 text-[#5C4E43]"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="list-decimal list-inside mb-6 space-y-2 text-[#5C4E43]"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="underline hover:text-[#8C7C6D] transition-colors text-[#2C2119]"
                  {...props}
                />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-medium text-[#2C2119]" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="border-l-2 border-[#E6DCC9] pl-4 italic my-6 text-[#8C7C6D]"
                  {...props}
                />
              ),
              table: ({ node, ...props }) => (
                <div className="overflow-x-auto my-8">
                  <table
                     className="w-full text-left border-collapse"
                     {...props}
                  />
                </div>
              ),
              th: ({ node, ...props }) => (
                <th
                  className="border-b border-[#E6DCC9] py-3 px-4 font-medium text-[#2C2119]"
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  className="border-b border-[#E6DCC9] py-3 px-4 text-[#5C4E43]"
                  {...props}
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
    </div>
  );
}
