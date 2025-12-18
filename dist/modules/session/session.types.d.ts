export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export interface DecodedRefreshToken {
    id: string;
    iat: number;
    exp: number;
}
