import { useBahasa } from "../context/bahasaContext";
import { translations } from "../../translations";

export function useTranslate() {
  const { state } = useBahasa();
  return translations[state.language];
}
