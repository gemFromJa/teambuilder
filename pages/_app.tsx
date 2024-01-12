import Page from "@/components/misc/page";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import AppContext from "@/store";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AppContext>
            <Page>
                <Component {...pageProps} />
            </Page>
        </AppContext>
    );
}
