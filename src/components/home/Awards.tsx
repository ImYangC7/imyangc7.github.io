export interface AwardItem {
    date: string;
    awards: string[];
    suffix?: string;
}

interface AwardsProps {
    items: AwardItem[];
    title?: string;
}

export default function Awards({ items, title = 'Awards' }: AwardsProps) {
    return (
        <section className="fade-in-up-d3">
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{title}</h2>
            <ul className="list-disc list-outside ml-4 space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="text-sm text-neutral-700">
                        <span className="italic text-neutral-500">{item.date}</span>
                        <span>, </span>
                        {item.awards.map((award, awardIndex) => (
                            <span key={awardIndex}>
                                {awardIndex > 0 && <span> and </span>}
                                <span className="font-bold">{award}</span>
                            </span>
                        ))}
                        {item.suffix && <span> {item.suffix}</span>}
                        <span>.</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
