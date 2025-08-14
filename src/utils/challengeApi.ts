// Utility for fetching dynamic challenges from remote API Gateway endpoint
// Keeps a simple cache per (occupation,difficulty) to avoid refetching repeatedly during a session.

export interface RemoteChallenge {
  question: string; // Full question text including any options
  answer?: string;  // Expected answer (may be multiple choice letter or free-form)
  hint?: string;    // Single hint supplied by model
}

const ENDPOINT = 'https://mlnc0zllig.execute-api.us-west-2.amazonaws.com/task-function';

// Simple in-memory cache so identical (occupation,difficulty) calls within TTL reuse the result
interface CacheEntry { data: RemoteChallenge; ts: number }
const cache = new Map<string, CacheEntry>();
let CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes default

function key(occupation: string, difficulty: number) { return `${occupation}::${difficulty}`; }

export function clearChallengeCache() { cache.clear(); }
export function setChallengeCacheTTL(ms: number) { CACHE_TTL_MS = ms; }

export async function fetchDynamicChallenge(
  occupation: string,
  difficulty: number,
  opts?: { forceRefresh?: boolean }
): Promise<RemoteChallenge> {
  const k = key(occupation, difficulty);
  const now = Date.now();
  if (!opts?.forceRefresh) {
    const existing = cache.get(k);
    if (existing && (now - existing.ts) < CACHE_TTL_MS) {
      return existing.data;
    } else if (existing) {
      cache.delete(k); // expired
    }
  }

  const payload = { occupation, difficulty };
  try {
    console.log('[challengeApi] fetching', ENDPOINT, payload);
    const resp = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!data || typeof data.question !== 'string') throw new Error('Invalid challenge format from API');
    const remote: RemoteChallenge = { question: data.question, answer: data.answer, hint: data.hint };
    cache.set(k, { data: remote, ts: now });
    return remote;
  } catch (err) {
    console.error('Failed to fetch dynamic challenge', err);
    const fallback: RemoteChallenge = {
      question: `Dynamic challenge service unavailable. Please try again later.\n\n(Occupation: ${occupation}, Difficulty: ${difficulty})`,
      hint: 'Service fallback: check network or API configuration.'
    };
    // Do not cache fallback (or optionally we could cache short-term). Leaving uncached aids retries.
    return fallback;
  }
}

// Helper to map internal worldType to occupation string expected by API
export function mapWorldTypeToOccupation(worldType: string): string {
  switch (worldType) {
    case 'frontend':
      return 'Frontend Engineer';
    case 'backend':
      return 'Backend Engineer';
    case 'datascience':
      return 'Data Scientist';
    default:
      return worldType;
  }
}
