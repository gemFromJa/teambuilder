import Page from "@/components/misc/page";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppContext from "@/store";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <Page className={inter.className}>
        <Component {...pageProps} />
      </Page>
    </AppContext>
  );
}
