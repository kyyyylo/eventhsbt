import "./globals.css";
export const metadata={
  title:"Housebets Sportsbook — Prototype",
  description:"A responsive, clickable five-page sportsbook design prototype."
};
export default function RootLayout({children}) {
  return <html lang="en"><body>{children}</body></html>;
}