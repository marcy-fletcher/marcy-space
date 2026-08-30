import "./globals.css";
import {Geist} from "next/font/google";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "@/components/theme-provider";

const geist = Geist({subsets: ['latin'], variable: '--font-sans'});

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}
