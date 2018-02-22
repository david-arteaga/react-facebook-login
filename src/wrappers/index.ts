import { facebookConfig } from "../config/facebook.config";
import { Facebook } from "./facebook/facebook.init";

export const initFacebook = () => new Facebook(facebookConfig)
