import { z } from 'zod';
import { getCongestionSnapshot } from '@/lib/providers/portCongestionProvider';
import { getDisruptionAlerts } from '@/lib/providers/disruptionProvider';
import { getWeatherAlerts } from '@/lib/providers/weatherProvider';
import { DailyBrief } from '@/lib/types/domain';

const briefSchema = z.object({
  headline: z.string().min(12),
  bullets: z.array(z.string().min(10)).min(3).max(5)
});

const topTrendText = (delta: number) => (delta > 0 ? `up ${delta.toFixed(1)}%` : `down ${Math.abs(delta).toFixed(1)}%`);

function buildTemplateBrief(params: {
  congestionTop: { name: string; shipsWaiting: number; trendDeltaPct: number };
  weatherTop: { location: string; condition: string };
  disruptionTop: { title: string };
}): DailyBrief {
  const { congestionTop, weatherTop, disruptionTop } = params;
  return {
    generatedAt: new Date().toISOString(),
    sourceMode: 'sample-template',
    headline: `Congestion pressure remains concentrated at ${congestionTop.name} as queue velocity deteriorates across priority lanes.`,
    bullets: [
      `${congestionTop.name} has ${congestionTop.shipsWaiting} vessels waiting, ${topTrendText(congestionTop.trendDeltaPct)} day-over-day.`,
      `${weatherTop.condition} near ${weatherTop.location} may add schedule volatility for nearby port and inland flows.`,
      `${disruptionTop.title} is the lead operational watch item for carriers and shippers in this cycle.`,
      'Shippers should rebalance buffer stock and monitor dwell-time-sensitive bookings in exposed trade lanes.'
    ]
  };
}

async function fetchOpenAIBrief(context: string): Promise<DailyBrief | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: 'You are a supply-chain intelligence analyst. Return strict JSON with keys headline and bullets.' },
        {
          role: 'user',
          content: `Create a concise daily supply chain brief from this context. Include logistics implications. Context: ${context}`
        }
      ],
      response_format: { type: 'json_object' }
    }),
    cache: 'no-store'
  });

  if (!response.ok) return null;
  const payload = await response.json();
  const raw = payload?.choices?.[0]?.message?.content;
  if (!raw || typeof raw !== 'string') return null;
  const parsed = briefSchema.safeParse(JSON.parse(raw));
  if (!parsed.success) return null;
  return {
    generatedAt: new Date().toISOString(),
    sourceMode: 'live-llm',
    headline: parsed.data.headline,
    bullets: parsed.data.bullets
  };
}

async function fetchAnthropicBrief(context: string): Promise<DailyBrief | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-5-haiku-latest',
      max_tokens: 350,
      temperature: 0.2,
      messages: [
        {
          role: 'user',
          content: `Return JSON only: {"headline":string,"bullets":string[]}. Use this context: ${context}`
        }
      ]
    }),
    cache: 'no-store'
  });

  if (!response.ok) return null;
  const payload = await response.json();
  const raw = payload?.content?.[0]?.text;
  if (!raw || typeof raw !== 'string') return null;
  const jsonStart = raw.indexOf('{');
  const jsonEnd = raw.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) return null;
  const parsed = briefSchema.safeParse(JSON.parse(raw.slice(jsonStart, jsonEnd + 1)));
  if (!parsed.success) return null;

  return {
    generatedAt: new Date().toISOString(),
    sourceMode: 'live-llm',
    headline: parsed.data.headline,
    bullets: parsed.data.bullets
  };
}

export async function getDailyBrief(): Promise<DailyBrief> {
  const [congestion, weather, disruptions] = await Promise.all([
    getCongestionSnapshot(),
    getWeatherAlerts(),
    getDisruptionAlerts()
  ]);

  const congestionTop = congestion.ports[0];
  const weatherTop = weather.alerts.sort((a, b) => severityToRank(b.severity) - severityToRank(a.severity))[0];
  const disruptionTop = disruptions.alerts.sort((a, b) => severityToRank(b.severity) - severityToRank(a.severity))[0];

  const context = JSON.stringify({
    topCongestion: congestionTop,
    topWeather: weatherTop,
    topDisruption: disruptionTop
  });

  try {
    const openAI = await fetchOpenAIBrief(context);
    if (openAI) return openAI;
    const anthropic = await fetchAnthropicBrief(context);
    if (anthropic) return anthropic;
  } catch {
    // fall through to deterministic template
  }

  return buildTemplateBrief({
    congestionTop: {
      name: congestionTop.name,
      shipsWaiting: congestionTop.shipsWaiting,
      trendDeltaPct: congestionTop.trendDeltaPct
    },
    weatherTop: { location: weatherTop.location, condition: weatherTop.condition },
    disruptionTop: { title: disruptionTop.title }
  });
}

function severityToRank(severity: string): number {
  if (severity === 'critical') return 4;
  if (severity === 'high') return 3;
  if (severity === 'medium') return 2;
  return 1;
}
