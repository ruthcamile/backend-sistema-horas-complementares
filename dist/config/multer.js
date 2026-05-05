"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const path_1 = __importDefault(require("path"));
// 1. Configurando o que vai ligar para o MinIO / AWS S3
const s3Config = new client_s3_1.S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    endpoint: process.env.AWS_S3_ENDPOINT,
    forcePathStyle: true,
});
// 2. Configurando a "Gaveta" do Multer para salvar na nuvem
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: process.env.AWS_S3_BUCKET,
        // 👇 AQUI ESTÁ A CORREÇÃO: Adicionamos ": any" nos parâmetros
        key: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension = path_1.default.extname(file.originalname);
            cb(null, `certificados/${file.fieldname}-${uniqueSuffix}${extension}`);
        },
    }),
});
exports.default = exports.upload;
//# sourceMappingURL=multer.js.map