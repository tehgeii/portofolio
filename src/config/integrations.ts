import { publicKeys } from "./public-keys";

/**
 * Which optional services are switched on. A VITE_* variable overrides the
 * committed key; the end-to-end test build uses that to switch features on
 * with dummy keys (see .env.e2e).
 */
const env = import.meta.env;

const goatcounterCode = (env.VITE_GOATCOUNTER_CODE || publicKeys.goatcounterCode).trim().toLowerCase();

export const integrations = {
  web3formsAccessKey: (env.VITE_WEB3FORMS_ACCESS_KEY || publicKeys.web3formsAccessKey).trim(),
  /** Only a plain site code is accepted, so it can safely become part of a URL. */
  goatcounterCode: /^[a-z0-9-]+$/.test(goatcounterCode) ? goatcounterCode : "",
};
