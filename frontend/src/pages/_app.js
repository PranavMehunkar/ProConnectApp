import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/config/redux/store";
import NavbarComponent from "@/Components/Navbar";

export default function App({ Component, pageProps }) {
  return <>
  <Provider store={store}>

      <Component {...pageProps} />
  </Provider>
    </>
}