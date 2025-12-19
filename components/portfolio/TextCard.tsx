/**
 * TextCard Component
 * 
 * Renders text content in the center of the card.
 * Uses Teko font family for consistent typography.
 */

interface TextCardProps {
  title: string;
}

export function TextCard({ title }: TextCardProps) {
  return (
    <div className="text-center">
      <h2
        className="text-4xl md:text-6xl lg:text-8xl font-bold uppercase"
        style={{ fontFamily: "'Teko', sans-serif" }}
      >
        {title}
      </h2>
    </div>
  );
}

