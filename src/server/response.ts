import { CookieInit, HeadersInit } from "bun";
import { BunRequest } from "./request";

interface ResponseInit {
    status: number;
    statusText: string;
    headers?: [string, any][] | Record<string, any> | Headers;
}

export class BunResponse {
    private response: Response;
    private options: ResponseInit = {
        status: 200,
        statusText: "OK"
    };
    private readonly request?: BunRequest;

    public locals: Record<string, string>;

    constructor(req?: BunRequest) {
        this.request = req;
    }

    status(code: number): this {
        this.options.status = code;
        return this;
    }

    option(option: ResponseInit): this {
        this.options = Object.assign(this.options, option);
        return this;
    }

    statusText(text: string): this {
        this.options.statusText = text;
        return this;
    }

    json(body: any): void {
        this.response = Response.json(body, this.options);
    }

    send(body: any): void {
        this.response = new Response(body, this.options);
    }

    redirect(url: string, status: number = 302): void {
        this.response = Response.redirect(url, status);
    }

    // nodejs way to set headers
    setHeader(key: string, value: any) {
        if (!key || !value) {
            throw new Error('Headers key or value should not be empty');
        }

        const headers = this.options.headers;
        if (!headers) {
            this.options.headers = { keys: value };
        }
        this.options.headers[key] = value;
        return this;
    }

    setCookie(name: string, value: string, options?: CookieInit) {
        this.request.cookies.set({
            name: name,
            value: value,
            ...options
        });
        this.setHeader("Set-Cookie", this.request.cookies.toSetCookieHeaders());
    }

    // nodejs way to get headers
    getHeader() {
        return this.options.headers;
    }

    headers(header: HeadersInit): this {
        this.options.headers = header;
        return this;
    }

    getResponse(): Response {
        return this.response;
    }

    isReady(): boolean {
        return !!this.response;
    }
}