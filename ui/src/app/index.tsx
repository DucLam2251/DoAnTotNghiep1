import { Provider } from "react-redux"
import store from "../redux"
import "./index.scss"
import Routing from "./Routing"
import { initializeIcons } from "@fluentui/react";
initializeIcons();

const App: React.FunctionComponent = () => {
  return (
      <Provider store={store}>
        <Routing/>             
      </Provider>
  )
}

export default App