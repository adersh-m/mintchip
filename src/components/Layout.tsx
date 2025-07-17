import type { ReactNode } from 'react';
import Navigation from './Navigation';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="py-6">
                {children}
            </main>
        </div>
    );
}
