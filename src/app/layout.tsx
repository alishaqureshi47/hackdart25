import Nav from "../components/Nav"
import Providers from "./providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quipp",
  description: "A web application to conduct surveys to students!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <Providers>
            <div className="top-navbar">
              <Nav />
            </div>
            {children}
          </Providers>
      </body>
    </html>
  );
}