import SessionManager from "./classes/SessionManager.class";
import { Request as ExpressRequest } from "express";
declare global {
    namespace Express {
        export interface Request {
            Session: SessionManager;
        }
    }
}
