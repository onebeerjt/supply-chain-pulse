export const hasKey = (key?: string) => Boolean(key && key.trim().length > 0);

export const modeFromKey = (key?: string): 'live' | 'sample' => (hasKey(key) ? 'live' : 'sample');
