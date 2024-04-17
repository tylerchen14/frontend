import "@/styles/globals.css";
import { PointContextProvider } from "@/context/use-points";
import { AnimateContextProvider } from "@/context/use-animate";
export default function App({ Component, pageProps }) {
  return (
    <AnimateContextProvider>
      <PointContextProvider>
        <Component {...pageProps} />
      </PointContextProvider>
    </AnimateContextProvider>
  )
}
