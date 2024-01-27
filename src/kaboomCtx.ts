import kaboom from "kaboom";
import { scale } from "./constants";

export const k = kaboom({
  width: 256 * scale,
  height: 144 * scale,
  letterbox: true,
  scale, // Work around for a Kaboom bug. Need to both set scaling here and scale sprites so that
  // each pixel takes mostly the correct amount of space.
  global: false,
});
