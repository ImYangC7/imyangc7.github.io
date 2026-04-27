import Link from 'next/link';
import Image from 'next/image';
import { Publication } from '@/types/publication';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title = 'Selected Publications', enableOnePageMode = false }: SelectedPublicationsProps) {
    return (
        <section className="fade-in-up-d1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={false}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    View All →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => (
                    <div
                        key={pub.id}
                        className="fade-in-up bg-neutral-50 p-4 rounded-lg shadow-sm border border-neutral-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                        style={{ animationDelay: `${Math.min(0.04 * index, 0.16)}s` }}
                    >
                        <div className="flex flex-col sm:flex-row gap-4">
                            {pub.preview && (
                                <div className="w-full sm:w-44 flex-shrink-0">
                                    <div className="relative p-1 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-neutral-200">
                                        {pub.venue && (
                                            <span
                                                className="absolute top-0 left-0 z-10 px-1.5 py-0.5 text-[10px] font-bold text-white bg-blue-900 rounded-br-md shadow-md"
                                                style={{ fontFamily: 'Arial, sans-serif' }}
                                            >
                                                {pub.venue}
                                            </span>
                                        )}
                                        <Image
                                            src={`/papers/${pub.preview}`}
                                            alt={pub.title}
                                            width={200}
                                            height={150}
                                            loading="lazy"
                                            sizes="(min-width: 640px) 200px, 100vw"
                                            className="w-full h-auto rounded hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-primary mb-2 leading-tight">
                                    {pub.doi || pub.url ? (
                                        <a
                                            href={pub.doi ? `https://doi.org/${pub.doi}` : pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-accent transition-colors duration-200"
                                        >
                                            {pub.title}
                                        </a>
                                    ) : (
                                        pub.title
                                    )}
                                </h3>
                                <p className="text-sm text-neutral-600 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                {author.name}
                                            </span>
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 '}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-sm text-neutral-600 mb-2">
                                    {pub.journal || pub.conference}, {pub.year}
                                </p>
                                {pub.description && (
                                    <p className="text-sm text-neutral-500 line-clamp-2">
                                        {pub.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
