import { mockWebcams } from '@/lib/data/mock-data';
import { Webcam } from '@/lib/types/domain';

export async function getWebcams(): Promise<{ sourceMode: 'sample'; webcams: Webcam[] }> {
  return { sourceMode: 'sample', webcams: mockWebcams };
}
