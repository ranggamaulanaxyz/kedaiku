import { createContext } from "react-router";
import type { AuthService } from "./service";
import type { User, Partner } from "./types";

export const userContext = createContext<User>();
export const partnerContext = createContext<Partner>();
export const authServiceContext = createContext<AuthService>();
