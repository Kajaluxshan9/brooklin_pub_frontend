// This file kept for compatibility. The chef-specific UI is now provided
// by the unified `SpecialDisplay` component. Re-export that component so
// existing imports continue to work while avoiding duplicate code.

export { default } from "./SpecialDisplay";
export { exportedChefSpecials } from "./SpecialDisplay";
