import "@/styles/globals.css";
import { PointContextProvider } from "@/contexts/use-points";
import { AnimateContextProvider } from "@/contexts/use-animate";
import { ViewToggleContextProvider } from "@/contexts/use-toggle-show";
import { GiftContextProvider } from "@/contexts/use-gift";

import { EffectContextProvider } from "@/contexts/use-effect";
export default function App({ Component, pageProps }) {
  return (
    <ViewToggleContextProvider>
      <PointContextProvider>
        <AnimateContextProvider>
          <GiftContextProvider>
            <EffectContextProvider>
              <Component {...pageProps} />
            </EffectContextProvider>
          </GiftContextProvider>
        </AnimateContextProvider>
      </PointContextProvider>
    </ViewToggleContextProvider>
  )
}
