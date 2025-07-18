import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGetCategoryReportQuery, useGetTimelineReportQuery } from '../api';

// Mock fetch for testing
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('reportsApi', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('hooks integration', () => {
        it('should export functional hooks', () => {
            // Test that hooks are exported and can be used
            expect(useGetCategoryReportQuery).toBeDefined();
            expect(useGetTimelineReportQuery).toBeDefined();
            expect(typeof useGetCategoryReportQuery).toBe('function');
            expect(typeof useGetTimelineReportQuery).toBe('function');
        });
    });
});
