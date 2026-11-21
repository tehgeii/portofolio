/**
 * Keys for third-party services that are safe to publish: they only let the
 * site send a message to Dafi's inbox or count a visit. An empty string turns
 * the feature off (the contact form falls back to the visitor's email app,
 * and the visitor counter is hidden).
 *
 * Never put a secret here. The YouTube API key, for example, is a GitHub
 * Actions secret and only used while building.
 */
export const publicKeys = {
  /** https://web3forms.com: messages from the contact form go to the inbox this key belongs to. */
  web3formsAccessKey: "",
  /** https://www.goatcounter.com: the site code, i.e. "<code>.goatcounter.com". */
  goatcounterCode: "",
};
