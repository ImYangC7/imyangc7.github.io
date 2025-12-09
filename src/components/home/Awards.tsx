'use client';

import { motion } from 'framer-motion';

export interface AwardItem {
    title: string;
    subtitle?: string;
    date: string;
    content?: string;
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

export default function Awards({ items, title = 'Awards' }: AwardsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                        <span className="text-xs text-neutral-500 mt-1 w-16 flex-shrink-0">{item.date}</span>
                        <div className="text-sm text-neutral-700 dark:text-neutral-400">
                            <span className="font-medium">{item.title}</span>
                            {item.subtitle && (
                                <span className="text-neutral-500"> · {item.subtitle}</span>
                            )}
                            {item.content && (
                                <p className="mt-0.5 text-neutral-500">{item.content}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}

