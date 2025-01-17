"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const next_auth_1 = __importDefault(require("next-auth"));
const credentials_1 = __importDefault(require("next-auth/providers/credentials"));
const google_1 = __importDefault(require("next-auth/providers/google"));
let useMockProvider = process.env.NODE_ENV === 'test';
const { Google_ID, GOOGLE_SECRET, NODE_ENV, APP_ENV } = process.env;
if ((NODE_ENV !== 'production' || APP_ENV === 'test') &&
    (!Google_ID || !GOOGLE_SECRET)) {
    console.log('⚠️ Using mocked GitHub auth correct credentials were not added');
    useMockProvider = true;
}
const providers = [];
if (useMockProvider) {
    providers.push((0, credentials_1.default)({
        id: 'github',
        name: 'Mocked GitHub',
        async authorize(credentials) {
            if (credentials) {
                const user = {
                    id: credentials.name,
                    name: credentials.name,
                    email: credentials.name,
                };
                return user;
            }
            return null;
        },
        credentials: {
            name: { type: 'test' },
        },
    }));
}
else {
    if (!Google_ID || !GOOGLE_SECRET) {
        throw new Error('Google_ID and GOOGLE_SECRET must be set');
    }
    providers.push((0, google_1.default)({
        clientId: Google_ID,
        clientSecret: GOOGLE_SECRET,
        profile(profile) {
            return {
                id: profile.id,
                name: profile.login,
                email: profile.email,
                image: profile.avatar_url,
            };
        },
    }));
}
exports.default = (0, next_auth_1.default)({
    // Configure one or more authentication providers
    providers,
});
