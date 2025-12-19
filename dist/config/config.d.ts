export declare const config: {
    readonly server: {
        readonly port: number;
        readonly nodeEnv: string;
        readonly clientUrl: string;
    };
    readonly database: {
        readonly url: string;
    };
    readonly auth: {
        readonly accessTokenSecret: string;
        readonly refreshTokenSecret: string;
        readonly accessTokenExpiry: `${number}s` | `${number}m` | `${number}h` | `${number}d`;
        readonly refreshTokenExpiry: `${number}s` | `${number}m` | `${number}h` | `${number}d`;
    };
    readonly smtp: {
        readonly host: string;
        readonly port: number;
        readonly user: string;
        readonly pass: string;
    };
    readonly redis: {
        readonly port: number;
        readonly host: string;
    };
    readonly bcrypt: {
        readonly salt_rounds: number;
    };
    readonly url: {
        readonly email_verification: string;
        readonly forget_password: string;
    };
    readonly google: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly callbackUrl: string;
    };
    readonly razorpay: {
        readonly keyId: string;
        readonly keySecret: string;
        readonly webhookSecret: string;
    };
    readonly aws: {
        readonly region: string;
        readonly accessKeyId: string;
        readonly secretAccessKey: string;
        readonly s3BucketName: string;
    };
};
