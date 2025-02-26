import style from "./ContractsOpened.module.scss"
import cs from "classnames"
import { useContractStorage } from "../../utils/hookts"

export function ContractsOpened() {
  const { data: issuerStorage } = useContractStorage(process.env.NEXT_PUBLIC_TZ_CT_ADDRESS_ISSUER!)
  
  return issuerStorage ? (
    <div className={cs(style.state, { [style.state_closed]: issuerStorage.paused })}>
      <span>MINT {issuerStorage.paused ? "CLOSED" : "OPENED"}</span>
      <div/>
    </div>
  ):null
}