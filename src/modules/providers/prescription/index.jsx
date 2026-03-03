import { PrescribingProvider } from "../../../lib/context/PrescribingContext"
import PrescriptionDetail from "../../../pages/dashboard/prescribing/id"

const PrescriptionDetailWithProvider = () => (
    <PrescribingProvider>
      <PrescriptionDetail />
    </PrescribingProvider>
  )
  
  export default PrescriptionDetailWithProvider
  