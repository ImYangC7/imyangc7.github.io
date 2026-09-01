import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
}

const MAX_VISIBLE_AUTHORS = 6;
const CATEGORY_ORDER = [
    'Tool-Using Agents',
    'Agentic Systems and Environments',
    'Code and Repository Intelligence',
    'Multimodal and Visual Reasoning',
    'Healthcare and Biomedical AI',
    'Foundations and Representation Learning',
    'Other',
];

function compactAuthors(authors: Publication['authors']) {
    if (authors.length <= MAX_VISIBLE_AUTHORS) {
        return authors;
    }

    return authors.slice(0, MAX_VISIBLE_AUTHORS);
}

function getCategory(publication: Publication) {
    return publication.tags[0] || 'Other';
}

export default function SelectedPublications({ publications, title = 'Selected Publications' }: SelectedPublicationsProps) {
    const groupedPublications = publications.reduce<Record<string, Publication[]>>((groups, publication) => {
        const category = getCategory(publication);
        groups[category] = groups[category] || [];
        groups[category].push(publication);
        return groups;
    }, {});

    const orderedGroups = Object.entries(groupedPublications).sort(([categoryA], [categoryB]) => {
        const indexA = CATEGORY_ORDER.indexOf(categoryA);
        const indexB = CATEGORY_ORDER.indexOf(categoryB);
        return (indexA === -1 ? CATEGORY_ORDER.length : indexA) - (indexB === -1 ? CATEGORY_ORDER.length : indexB);
    });

    return (
        <section className="fade-in-up-d1">
            <h2 className="text-2xl font-serif italic font-bold text-primary mb-5">{title}</h2>
            <div className="space-y-5">
                {orderedGroups.map(([category, categoryPublications]) => {
                    return (
                        <div key={category} className="space-y-2">
                            <h3 className="text-base font-serif font-semibold text-primary">{category}</h3>
                            <ul className="ml-4 space-y-3 border-l border-neutral-200 pl-4">
                                {categoryPublications.map((pub, index) => (
                                    <li
                                        key={pub.id}
                                        className="fade-in-up leading-relaxed"
                                        style={{ animationDelay: `${Math.min(0.04 * index, 0.16)}s` }}
                                    >
                                        <h4 className="inline text-[0.95rem] font-semibold text-primary leading-snug">
                                            {pub.doi || pub.url ? (
                                                <a
                                                    href={pub.doi ? `https://doi.org/${pub.doi}` : pub.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-accent transition-colors duration-200 underline decoration-neutral-300 underline-offset-4 hover:decoration-accent"
                                                >
                                                    {pub.title}
                                                </a>
                                            ) : (
                                                pub.title
                                            )}
                                        </h4>
                                        <p className="mt-1 text-sm text-neutral-600">
                                            {compactAuthors(pub.authors).map((author, idx, visibleAuthors) => (
                                                <span key={idx}>
                                                    <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                        {author.name}
                                                    </span>
                                                    {author.isCorresponding && (
                                                        <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600'}`}>†</sup>
                                                    )}
                                                    {idx < visibleAuthors.length - 1 && ', '}
                                                </span>
                                            ))}
                                            {pub.authors.length > MAX_VISIBLE_AUTHORS && (
                                                <span>, et al.</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-neutral-600">
                                            {[pub.venue || pub.journal || pub.conference, pub.year].filter(Boolean).join(' · ')}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
