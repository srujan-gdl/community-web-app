import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiFetch, ApiError, createCommunity, getCommunities, createUnit, onboardResident } from '../lib/api';

// We stub `fetch` globally for each test
function mockFetch(status, body) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }));
}

describe('api.js — apiFetch', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns parsed data on 200', async () => {
    mockFetch(200, { communities: [] });
    const data = await apiFetch('/api/v1/communities');
    expect(data).toEqual({ communities: [] });
  });

  it('injects the JWT Authorization header when token exists', async () => {
    sessionStorage.setItem('cotogate_token', 'test-jwt-token');
    mockFetch(200, { ok: true });
    await apiFetch('/api/v1/communities');
    const call = fetch.mock.calls[0];
    expect(call[1].headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('does not inject Authorization header when no token', async () => {
    mockFetch(200, {});
    await apiFetch('/api/v1/communities');
    const call = fetch.mock.calls[0];
    expect(call[1].headers.Authorization).toBeUndefined();
  });

  it('throws ApiError with status on 401', async () => {
    mockFetch(401, { message: 'Unauthorized' });
    await expect(apiFetch('/api/v1/protected')).rejects.toThrow(ApiError);
    await expect(apiFetch('/api/v1/protected')).rejects.toMatchObject({ status: 401 });
  });

  it('throws ApiError on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    await expect(apiFetch('/api/v1/communities')).rejects.toThrow(ApiError);
    await expect(apiFetch('/api/v1/communities')).rejects.toMatchObject({ status: 0 });
  });
});

describe('api.js — endpoint helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('getCommunities calls GET /api/v1/communities', async () => {
    mockFetch(200, []);
    await getCommunities();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/communities'),
      expect.any(Object)
    );
  });

  it('createCommunity calls POST with JSON body', async () => {
    mockFetch(201, { id: 'new-id' });
    const payload = { name: 'Test Coto', address: 'Blvd Test 1', timezone: 'America/Monterrey' };
    await createCommunity(payload);
    const call = fetch.mock.calls[0];
    expect(call[1].method).toBe('POST');
    expect(JSON.parse(call[1].body)).toEqual(payload);
  });

  it('createUnit calls POST to correct community endpoint', async () => {
    mockFetch(201, { id: 'unit-new' });
    await createUnit('comm-1', { house: '101', block: 'A', balance: 0 });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/communities/comm-1/units'),
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('onboardResident calls POST with correct path', async () => {
    mockFetch(201, { id: 'res-new' });
    await onboardResident({ email: 'test@test.com' });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/auth/onboard-resident'),
      expect.objectContaining({ method: 'POST' })
    );
  });
});
