import "@/styles/globals.css";
import { PointContextProvider } from "@/context/use-points";
export default function App({ Component, pageProps }) {
  return (
    <PointContextProvider>
      <Component {...pageProps} />
    </PointContextProvider>
  )
}
