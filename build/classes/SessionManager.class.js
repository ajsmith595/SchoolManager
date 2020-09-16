"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let SessionManager = /** @class */ (() => {
    class SessionManager {
        constructor(id) {
            this.id = id;
        }
        static Get(id) {
            if (!SessionManager.Map[id])
                SessionManager.Map[id] = {};
            return new SessionManager(id);
        }
        Get(key) {
            SessionManager.Get(this.id);
            return SessionManager.Map[this.id][key];
        }
        Set(key, value) {
            SessionManager.Get(this.id);
            SessionManager.Map[this.id][key] = value;
        }
        Reset() {
            delete SessionManager.Map[this.id];
        }
    }
    SessionManager.Map = {};
    return SessionManager;
})();
exports.default = SessionManager;
