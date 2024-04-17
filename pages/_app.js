import "@/styles/globals.css";
import { PointContextProvider } from "@/context/use-points";
import { AnimateContextProvider } from "@/context/use-animate";
import { ViewToggleContextProvider } from "@/context/use-toggle-show";
import { GiftContextProvider } from "@/context/use-gift";

import { EffectContextProvider } from "@/context/use-effect";
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
