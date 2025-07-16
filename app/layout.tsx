
import './globals.css';
import type { Metadata } from 'next';
import ReactQueryClient from './queryProvider';

export const metadata: Metadata = {
  title: 'Task Planner - Organize Your Life',
  description: 'A beautiful and intuitive task planner with calendar integration, progress tracking, and smart notifications.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <ReactQueryClient>
          {children}
        </ReactQueryClient>
      </body>
    </html>
  );
}
