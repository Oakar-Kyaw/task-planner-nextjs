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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <ReactQueryClient>
          {children}
        </ReactQueryClient>
      </body>
    </html>
  );
}