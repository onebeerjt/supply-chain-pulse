import { Webcam } from '@/lib/types/domain';
import { WebcamCard } from '@/components/dashboard/webcam-card';
import { Card } from '@/components/ui/card';

export function WebcamGrid({ webcams }: { webcams: Webcam[] }) {
  return (
    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-cyan-100">Live Port Webcams</h3>
      <p className="text-sm text-slate-400">Streams may open on external official pages when direct embeds are restricted.</p>
      {webcams.length === 0 ? (
        <Card className="p-4 text-sm text-slate-300">No webcam sources are available for the current selection.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {webcams.map((cam) => (
            <WebcamCard key={cam.id} webcam={cam} />
          ))}
        </div>
      )}
    </section>
  );
}
