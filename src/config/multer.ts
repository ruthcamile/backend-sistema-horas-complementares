import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(__dirname, '../../uploads/certificados');

// I/O Validation: Garante a criação do diretório caso não exista no File System
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Parser string para evitar quebra de encoding em nomes com espaço
    const nomeArquivo = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;
    cb(null, nomeArquivo);
  }
});

export const upload = multer({ storage });