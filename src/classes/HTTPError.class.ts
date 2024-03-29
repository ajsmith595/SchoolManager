export default class HTTPError extends Error {
    static readonly Map: { [i: number]: string } = {
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        405: "Method Not Allowed",
        406: "Not Acceptable",
        407: "Proxy Authentication Required",
        408: "Request Timeout",
        409: "Conflict",
        410: "Gone",
        411: "Length Required",
        412: "Precondition Failed",
        413: "Request Entity Too Large",
        414: "Request-URI Too Long",
        415: "Unsupported Media Type",
        416: "Requested Range Not Satisfiable",
        417: "Expectation Failed",
        418: "I'm a teapot",
        // 420: "Enhance Your Calm (Twitter)",
        // 422: "Unprocessable Entity (WebDAV)",
        // 423: "Locked (WebDAV)",
        // 424: "Failed Dependency (WebDAV)",
        // 425: "Reserved for WebDAV",
        426: "Upgrade Required",
        428: "Precondition Required",
        429: "Too Many Requests",
        431: "Request Header Fields Too Large",
        // 444: "No Response (Nginx)",
        // 449: "Retry With (Microsoft)",
        // 450: "Blocked by Windows Parental Controls (Microsoft)",
        451: "Unavailable For Legal Reasons",
        // 499: "Client Closed Request (Nginx)",
        500: "Internal Server Error",
        501: "Not Implemented",
        502: "Bad Gateway",
        503: "Service Unavailable",
        504: "Gateway Timeout",
        505: "HTTP Version Not Supported",
        // 506: "Variant Also Negotiates (Experimental)",
        // 507: "Insufficient Storage (WebDAV)",
        // 508: "Loop Detected (WebDAV)",
        // 509: "Bandwidth Limit Exceeded (Apache)",
        510: "Not Extended",
        511: "Network Authentication Required",
        598: "Network read timeout error",
        599: "Network connect timeout error",
    };
    code: number;
    constructor(code: number) {
        let message = HTTPError.Map[code] || "An unknown error occured";
        super(message);
        this.name = "HTTPError";
        this.code = code;
    }
}
