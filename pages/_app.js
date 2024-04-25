import "@/styles/globals.css";
import { PointContextProvider } from "@/contexts/use-points";
import { ViewToggleContextProvider } from "@/contexts/use-toggle-show";
import { GiftContextProvider } from "@/contexts/use-gift";
import { StreamInfoContextProvider } from "@/contexts/use-streamInfo";

import { EffectContextProvider } from "@/contexts/use-effect";
export default function App({ Component, pageProps }) {
  return (
    <StreamInfoContextProvider>
      <ViewToggleContextProvider>
        <GiftContextProvider>

          <PointContextProvider>

            <EffectContextProvider>
              <Component {...pageProps} />
            </EffectContextProvider>

          </PointContextProvider>

        </GiftContextProvider>
      </ViewToggleContextProvider>
    </StreamInfoContextProvider>
  )
}
