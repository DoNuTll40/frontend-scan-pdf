
import { useContext } from "react"
import WSContext from "../contexts/WSContext";

function WSHook() {
    const context = useContext(WSContext);
    if (context === undefined) {
        throw new Error('WSHook must be used with in an WSProvider')
    }
  return context
}

export default WSHook