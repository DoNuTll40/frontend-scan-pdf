
import { useContext } from "react"
import AppContext from "../contexts/AppContext"

function AppHook() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('AppHooks must be used with in an AppProvider')
    }
  return context
}

export default AppHook