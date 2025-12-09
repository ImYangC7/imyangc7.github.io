'use client';

import { motion } from 'framer-motion';

export interface CompetitionItem {
    date: string;
    name: string;
    url?: string;
    prize: string;
    role: string;
}

interface CompetitionsProps {
    national: CompetitionItem[];
    provincial: CompetitionItem[];
    title?: string;
}

function CompetitionList({ items, maxHeight = '200px' }: { items: CompetitionItem[]; maxHeight?: string }) {
    return (
        <div
            className="overflow-y-auto pr-2 space-y-2"
            style={{ maxHeight }}
        >
            <ul className="list-disc list-outside ml-4 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="text-sm text-neutral-700 dark:text-neutral-400">
                        <span className="text-neutral-500">{item.date}: </span>
                        {item.url ? (
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-700 dark:text-neutral-400 hover:underline"
                            >
                                {item.name}
                            </a>
                        ) : (
                            <span>{item.name}</span>
                        )}
                        <span className="text-neutral-500"> (</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-500">{item.prize}</span>
                        <span className="text-neutral-500">, </span>
                        <span>{item.role}</span>
                        <span className="text-neutral-500">)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Competitions({ national, provincial, title = 'Competitions' }: CompetitionsProps) {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            
            <div className="space-y-4">
                {/* International & National Prizes */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                        International & National Prizes
                    </h3>
                    <CompetitionList items={national} maxHeight="220px" />
                    <p className="text-xs text-neutral-400 mt-1">↕ Scrollable</p>
                </div>

                {/* Regional & Provincial Prizes */}
                <div>
                    <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-300 mb-2">
                        Regional & Provincial Prizes
                    </h3>
                    <CompetitionList items={provincial} maxHeight="180px" />
                    <p className="text-xs text-neutral-400 mt-1">↕ Scrollable</p>
                </div>
            </div>
        </motion.section>
    );
}

