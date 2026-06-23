import type { User } from "@supabase/supabase-js";
import { createContext, RouterContextProvider } from "react-router";
import type { AuthService } from "./service";

export const userContext = createContext<User>();
export const authServiceContext = createContext<AuthService>();
