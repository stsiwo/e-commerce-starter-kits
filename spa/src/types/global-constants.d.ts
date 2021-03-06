// gloabl constants
declare const API1_URL: string;

declare const PUBLIC_IMAGE_PATH: string;

declare const NODE_ENV: string;

declare const OWNER_BUCKET_NAME: string;

declare const TEST_ADMIN_USER_ID: string;

declare const TEST_ADMIN_EMAIL: string;

declare const TEST_MEMBER_USER_ID: string;

declare const TEST_MEMBER_EMAIL: string;

declare const TEST_USER_PASSWORD: string;

declare const CHECKOUT_SESSION_TIMEOUT: string;

declare const RECAPTCHA_SITE_KEY: string;

declare const JWT_TOKEN_EXPIRY: string;

// recaptcha
declare const grecaptcha: any;

/**
 * typeScript Error:
 *  - create below module declaration.
 *  - ref: https://stackoverflow.com/questions/52759220/importing-images-in-typescript-react-cannot-find-module
 **/
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
declare module "*.gif";
declare module "*.jpeg";
