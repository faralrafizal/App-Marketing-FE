import Navbar from "../../../components/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Session from "../../../components/Session";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PT Cahaya Mas Cemerlang",
  description: "Management Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Session>
        <Navbar />
        {children}
      </Session>
      </body>
    </html>
  );
}
