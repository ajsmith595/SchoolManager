import { Request as ExpressRequest } from "express";

class SessionManager {
    private static Map: { [id: string]: { [k: string]: any } } = {};
    static Get(id: string) {
        if (!SessionManager.Map[id]) SessionManager.Map[id] = {};
        return new SessionManager(id);
    }

    private id: string;
    private constructor(id: string) {
        this.id = id;
    }
    public Get(key: string) {
        SessionManager.Get(this.id);
        return SessionManager.Map[this.id][key];
    }
    public Set(key: string, value: any) {
        SessionManager.Get(this.id);
        SessionManager.Map[this.id][key] = value;
    }
    public Reset() {
        delete SessionManager.Map[this.id];
    }
}

namespace SessionManager {
    export interface Request extends ExpressRequest {
        Session: SessionManager;
    }
}

export default SessionManager;
