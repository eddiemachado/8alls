import '@8alls/design-tokens/styles/global.css';
import './globals.css';

export const metadata = {
  title: '8alls Tasks',
  description: 'Task management powered by 8alls',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
