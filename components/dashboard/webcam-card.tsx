import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Webcam } from '@/lib/types/domain';

export function WebcamCard({ webcam }: { webcam: Webcam }) {
  return (
    <Card className="overflow-hidden">
      {webcam.isEmbeddable && webcam.embedUrl ? (
        <iframe title={webcam.title} src={webcam.embedUrl} className="h-44 w-full" loading="lazy" />
      ) : (
        <div className="relative h-44 w-full">
          <Image src={webcam.previewImage} alt={webcam.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      )}
      <div className="space-y-2 p-3">
        <p className="text-sm font-semibold text-slate-100">{webcam.title}</p>
        <p className="text-xs text-slate-400">Source: {webcam.sourceName}</p>
        <a href={webcam.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline">
          Watch Live <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  );
}
