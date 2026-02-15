import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GameStats {
    gamesPlayed: bigint;
    wins: bigint;
    losses: bigint;
    bestScore: bigint;
}
export interface UserProfile {
    name: string;
}
export interface UserGameStats {
    gameMode1: GameStats;
    gameMode2: GameStats;
    gameMode3: GameStats;
    gameMode4: GameStats;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyStats(): Promise<UserGameStats | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserStats(user: Principal): Promise<UserGameStats | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMyStats(newStats: UserGameStats): Promise<void>;
}
