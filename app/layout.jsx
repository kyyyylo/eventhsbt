import "./globals.css";

export const metadata = {
  title: "Housebets Sportsbook — Final Prototype",
  description: "A five-page, responsive, singles-only sportsbook concept for Housebets Contest Labs."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
