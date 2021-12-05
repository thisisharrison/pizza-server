import ProductionKeys from "./keys_prod";
import DevelopmentKeys from "./keys_dev";

interface Config {
    mongoURI: string;
    secretOrKey: string;
    allowedOrigin: string;
}

let keys;
if (process.env.NODE_ENV === "production") {
    keys = ProductionKeys;
} else {
    keys = DevelopmentKeys;
}

export default keys as Config;
