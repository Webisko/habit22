import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';

interface MarkdownViewProps {
  title: string;
  content: string;
}

export default function MarkdownView({ title, content }: MarkdownViewProps) {
  return (
    <main className="flex-grow w-full min-h-screen pt-32 md:pt-40 lg:pt-44 pb-24 px-6 md:px-12 max-w-[800px] mx-auto flex flex-col relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-5xl font-serif text-[#2C2119] tracking-wider uppercase mb-16 text-center">
          {title}
        </h1>
        <div className="prose prose-[#5C4E43] font-serif prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null, // Hide H1 as we already display it
              h2: ({ ...props }) => (
                <h2
                  className="text-xl md:text-2xl text-[#2C2119] mt-12 mb-4 font-medium"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="text-lg md:text-xl text-[#2C2119] mt-8 mb-4 font-medium"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p className="leading-relaxed mb-6" {...props} />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="list-disc list-inside mb-6 space-y-2 text-[#5C4E43]"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="list-decimal list-inside mb-6 space-y-2 text-[#5C4E43]"
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              a: ({ ...props }) => (
                <a
                  className="underline hover:text-[#8C7C6D] transition-colors text-[#2C2119]"
                  {...props}
                />
              ),
              strong: ({ ...props }) => (
                <strong className="font-medium text-[#2C2119]" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-2 border-[#E6DCC9] pl-4 italic my-6 text-[#8C7C6D]"
                  {...props}
                />
              ),
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-8">
                  <table
                    className="w-full text-left border-collapse"
                    {...props}
                  />
                </div>
              ),
              th: ({ ...props }) => (
                <th
                  className="border-b border-[#E6DCC9] py-3 px-4 font-medium text-[#2C2119]"
                  {...props}
                />
              ),
              td: ({ ...props }) => (
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
      </motion.div>
    </main>
  );
}
