'use client';

import { motion } from 'framer-motion';

export interface NewsItem {
    date: string;
    content: string;
    icon?: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
}

// 解析 Markdown 链接 [text](url)
function parseMarkdownLinks(text: string): React.ReactNode[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
        // 添加链接前的文字
        if (match.index > lastIndex) {
            parts.push(text.slice(lastIndex, match.index));
        }
        // 添加链接
        parts.push(
            <a
                key={match.index}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline font-medium"
            >
                {match[1]}
            </a>
        );
        lastIndex = match.index + match[0].length;
    }

    // 添加剩余文字
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
}

export default function News({ items, title = 'News' }: NewsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <p className="text-sm text-neutral-700 dark:text-neutral-400">
                            {item.icon && <span className="mr-1">{item.icon}</span>}
                            {parseMarkdownLinks(item.content)}
                        </p>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
