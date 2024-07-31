
import { useContext } from "react"
import RigthContext from "../contexts/RightContext";

function RigthHook() {
    const context = useContext(RigthContext);
    if (context === undefined) {
        throw new Error('RigthContext must be used with in an RigthContextProvider')
    }
  return context
}

export default RigthHook