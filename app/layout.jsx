import "./globals.css";

export const metadata = {
  title: "Housebets Sportsbook — Final Prototype",
  description: "Sportsbook concept for Housebets Contest Labs."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
