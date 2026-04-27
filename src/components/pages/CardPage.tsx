import { CardPageConfig } from '@/types/page';

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    return (
        <div className="fade-in-up-d1">
            <div className={embedded ? "mb-4" : "mb-8"}>
                <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
                {config.description && (
                    <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600  max-w-2xl`}>
                        {config.description}
                    </p>
                )}
            </div>

            <div className={`grid ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <div
                        key={index}
                        className={`fade-in-up bg-white  ${embedded ? "p-4" : "p-6"} rounded-xl shadow-sm border border-neutral-200  hover:shadow-lg transition-all duration-200 hover:scale-[1.01]`}
                        style={{ animationDelay: `${Math.min(0.04 * index, 0.16)}s` }}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`${embedded ? "text-lg" : "text-xl"} font-semibold text-primary`}>{item.title}</h3>
                            {item.date && (
                                <span className="text-sm text-neutral-500 font-medium bg-neutral-100 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-accent font-medium mb-3`}>{item.subtitle}</p>
                        )}
                        {item.content && (
                            <p className={`${embedded ? "text-sm" : "text-base"} text-neutral-600  leading-relaxed`}>
                                {item.content}
                            </p>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="text-xs text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-100">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
