'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    BookOpenIcon,
    ClipboardDocumentIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { PublicationPageConfig } from '@/types/page';
import { cn } from '@/lib/utils';

interface PublicationsListProps {
    config: PublicationPageConfig;
    publications: Publication[];
    embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
    const [selectedType, setSelectedType] = useState<string | 'all'>('all');
    const [showFilters, setShowFilters] = useState(false);
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);
    const [expandedAbstractId, setExpandedAbstractId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const years = useMemo(() => {
        const uniqueYears = Array.from(new Set(publications.map(p => p.year)));
        return uniqueYears.sort((a, b) => b - a);
    }, [publications]);

    const types = useMemo(() => {
        const uniqueTypes = Array.from(new Set(publications.map(p => p.type)));
        return uniqueTypes.sort();
    }, [publications]);

    const filteredPublications = useMemo(() => {
        return publications.filter(pub => {
            const matchesSearch =
                pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.authors.some(author => author.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                pub.journal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pub.conference?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesYear = selectedYear === 'all' || pub.year === selectedYear;
            const matchesType = selectedType === 'all' || pub.type === selectedType;

            return matchesSearch && matchesYear && matchesType;
        });
    }, [publications, searchQuery, selectedYear, selectedType]);

    return (
        <div className="fade-in-up-d1">
            <div className="mb-8">
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            {/* Search and Filter Controls */}
            <div className="mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                            type="text"
                            placeholder="Search publications..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            "flex items-center justify-center px-4 py-2 rounded-lg border transition-all duration-200",
                            showFilters
                                ? "bg-accent text-white border-accent"
                                : "bg-white border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent"
                        )}
                    >
                        <FunnelIcon className="h-5 w-5 mr-2" />
                        Filters
                    </button>
                </div>

                <div className={cn("collapse-grid", showFilters && "is-open")} aria-hidden={!showFilters}>
                    <div className="collapse-inner">
                        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 flex flex-wrap gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" /> Year
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedYear('all')}
                                        className={cn(
                                            "px-3 py-1 text-xs rounded-full transition-colors",
                                            selectedYear === 'all'
                                                ? "bg-accent text-white"
                                                : "bg-white text-neutral-600 hover:bg-neutral-100"
                                        )}
                                    >
                                        All
                                    </button>
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={cn(
                                                "px-3 py-1 text-xs rounded-full transition-colors",
                                                selectedYear === year
                                                    ? "bg-accent text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-700 flex items-center">
                                    <BookOpenIcon className="h-4 w-4 mr-1" /> Type
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => setSelectedType('all')}
                                        className={cn(
                                            "px-3 py-1 text-xs rounded-full transition-colors",
                                            selectedType === 'all'
                                                ? "bg-accent text-white"
                                                : "bg-white text-neutral-600 hover:bg-neutral-100"
                                        )}
                                    >
                                        All
                                    </button>
                                    {types.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={cn(
                                                "px-3 py-1 text-xs rounded-full capitalize transition-colors",
                                                selectedType === type
                                                    ? "bg-accent text-white"
                                                    : "bg-white text-neutral-600 hover:bg-neutral-100"
                                            )}
                                        >
                                            {type.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Publications Grid */}
            <div className="space-y-6">
                {filteredPublications.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500">
                        No publications found matching your criteria.
                    </div>
                ) : (
                    filteredPublications.map((pub, index) => (
                        <div
                            key={pub.id}
                            className="fade-in-up bg-white p-6 rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-all duration-200"
                            style={{ animationDelay: `${Math.min(0.03 * index, 0.18)}s` }}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {pub.preview && (
                                    <div className="w-full md:w-52 flex-shrink-0">
                                        <div
                                            className="relative p-1 rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow duration-300 ring-1 ring-neutral-200 cursor-zoom-in"
                                            onClick={() => setLightboxImage(`/papers/${pub.preview}`)}
                                        >
                                            {pub.venue && (
                                                <span
                                                    className="absolute top-0 left-0 z-10 px-2 py-1 text-xs font-bold text-white bg-blue-900 rounded-br-md shadow-md"
                                                    style={{ fontFamily: 'Arial, sans-serif' }}
                                                >
                                                    {pub.venue}
                                                </span>
                                            )}
                                            <Image
                                                src={`/papers/${pub.preview}`}
                                                alt={pub.title}
                                                width={300}
                                                height={200}
                                                loading="lazy"
                                                sizes="(min-width: 768px) 208px, 100vw"
                                                className="w-full h-auto rounded hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow">
                                    <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary mb-2 leading-tight`}>
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
                                    <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600 mb-2`}>
                                        {pub.authors.map((author, idx) => (
                                            <span key={idx}>
                                                <span className={`${author.isHighlighted ? 'font-semibold text-accent' : ''} ${author.isCoAuthor ? `underline underline-offset-4 ${author.isHighlighted ? 'decoration-accent' : 'decoration-neutral-400'}` : ''}`}>
                                                    {author.name}
                                                </span>
                                                {author.isCorresponding && (
                                                    <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600'}`}>†</sup>
                                                )}
                                                {idx < pub.authors.length - 1 && ', '}
                                            </span>
                                        ))}
                                    </p>
                                    <p className="text-sm font-medium text-neutral-800 mb-3">
                                        {pub.journal || pub.conference}, {pub.year}
                                    </p>

                                    {pub.description && (
                                        <p className="text-sm text-neutral-600 mb-4 line-clamp-3">
                                            {pub.description}
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {pub.doi && (
                                            <a
                                                href={`https://doi.org/${pub.doi}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                DOI
                                            </a>
                                        )}
                                        {pub.code && (
                                            <a
                                                href={pub.code}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white transition-colors"
                                            >
                                                Code
                                            </a>
                                        )}
                                        {pub.abstract && (
                                            <button
                                                onClick={() => setExpandedAbstractId(expandedAbstractId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                    expandedAbstractId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <DocumentTextIcon className="h-3 w-3 mr-1.5" />
                                                Abstract
                                            </button>
                                        )}
                                        {pub.bibtex && (
                                            <button
                                                onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                                className={cn(
                                                    "inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors",
                                                    expandedBibtexId === pub.id
                                                        ? "bg-accent text-white"
                                                        : "bg-neutral-100 text-neutral-700 hover:bg-accent hover:text-white"
                                                )}
                                            >
                                                <BookOpenIcon className="h-3 w-3 mr-1.5" />
                                                BibTeX
                                            </button>
                                        )}
                                    </div>

                                    {pub.abstract && (
                                        <div className={cn("collapse-grid mt-4", expandedAbstractId === pub.id && "is-open")}>
                                            <div className="collapse-inner">
                                                <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                    <p className="text-sm text-neutral-600 leading-relaxed">
                                                        {pub.abstract}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {pub.bibtex && (
                                        <div className={cn("collapse-grid mt-4", expandedBibtexId === pub.id && "is-open")}>
                                            <div className="collapse-inner">
                                                <div className="relative bg-neutral-50 rounded-lg p-4 border border-neutral-200">
                                                    <pre className="text-xs text-neutral-600 overflow-x-auto whitespace-pre-wrap font-mono">
                                                        {pub.bibtex}
                                                    </pre>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(pub.bibtex || '');
                                                        }}
                                                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white text-neutral-500 hover:text-accent shadow-sm border border-neutral-200 transition-colors"
                                                        title="Copy to clipboard"
                                                    >
                                                        <ClipboardDocumentIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Lightbox Modal */}
            {lightboxImage && (
                <div
                    className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setLightboxImage(null)}
                >
                    <div
                        className="zoom-in relative max-w-[90vw] max-h-[90vh] p-2 bg-white rounded-xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-lg text-neutral-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => setLightboxImage(null)}
                        >
                            ✕
                        </button>
                        <Image
                            src={lightboxImage}
                            alt="Enlarged preview"
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[85vh] w-auto h-auto rounded-lg object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
