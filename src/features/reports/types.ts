// Report interfaces for category and timeline analytics
export interface CategoryReportItem {
    category: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
}

export interface CategoryReport {
    categories: CategoryReportItem[];
    totalAmount: number;
    period: {
        start: string;
        end: string;
    };
}

export interface TimelineReportItem {
    date: string; // ISO date string (YYYY-MM-DD)
    totalAmount: number;
    transactionCount: number;
    categories: {
        [category: string]: number;
    };
}

export interface TimelineReport {
    timeline: TimelineReportItem[];
    totalAmount: number;
    period: {
        start: string;
        end: string;
    };
    categories: string[];
}

// Query parameters for reports
export interface ReportParams {
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    category?: string; // Optional category filter
}
