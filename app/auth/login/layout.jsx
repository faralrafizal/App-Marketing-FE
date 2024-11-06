// import "@/app/main/(dashboard)/globals.css";
import "/app/main/(dashboard)/globals.css"
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
export default function LoginLayout({ children }) {
  return (
      <div>
        {children}
      </div>
  );
}
