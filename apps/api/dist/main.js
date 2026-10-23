"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const app_module_js_1 = require("./app.module.js");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const all_exceptions_filter_js_1 = require("./common/filters/all-exceptions.filter.js");
for (const envCandidate of ['.env.local', '.env']) {
    const envPath = (0, path_1.resolve)(process.cwd(), envCandidate);
    if ((0, fs_1.existsSync)(envPath) && typeof process.loadEnvFile === 'function') {
        try {
            process.loadEnvFile(envPath);
            break;
        }
        catch {
        }
    }
}
function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object')
        return obj;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        }
        else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        }
    }
    return obj;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_js_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use((req, _res, next) => {
        if (req.body)
            sanitizeObject(req.body);
        if (req.params)
            sanitizeObject(req.params);
        next();
    });
    const express = await Promise.resolve().then(() => __importStar(require('express')));
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ limit: '5mb', extended: true }));
    const configuredOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    app.enableCors({
        origin: (requestOrigin, callback) => {
            if (!requestOrigin) {
                return callback(null, true);
            }
            const isAllowed = configuredOrigins.includes(requestOrigin) ||
                requestOrigin.includes('localhost') ||
                /\.vercel\.app$/.test(new URL(requestOrigin).hostname);
            if (isAllowed) {
                callback(null, true);
            }
            else {
                callback(new Error(`CORS blocked request from origin: ${requestOrigin}`));
            }
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.useGlobalFilters(new all_exceptions_filter_js_1.AllExceptionsFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map