import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "SwipeStudy - Learn by Swiping",
    description: "A high-performance, swipe-based learning path generator. Discover curated resources with intuitive gestures.",
    keywords: ["learning", "education", "swipe", "flashcards", "system design", "resources"],
    authors: [{ name: "SwipeStudy" }],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
    themeColor: "#000000",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="h-full bg-mesh antialiased">
                {/* Main App Container */}
                <div className="h-full w-full max-w-md mx-auto relative">
                    {children}
                </div>
            </body>
        </html>
    );
}
