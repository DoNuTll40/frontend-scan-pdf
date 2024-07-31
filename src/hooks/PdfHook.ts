
import { useContext } from "react"
import PdfContext from "../contexts/pdfContext";

function PdfHook() {
    const context = useContext(PdfContext);
    if (context === undefined) {
        throw new Error('PdfHooks must be used with in an PdfProvider')
    }
  return context
}

export default PdfHook