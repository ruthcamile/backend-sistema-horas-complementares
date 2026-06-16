-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `role` ENUM('ALUNO', 'COORDENADOR') NOT NULL DEFAULT 'ALUNO',
    `departamento` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AreaAtividade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `limiteHorasArea` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Curso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuariosCursos` (
    `usuarioId` INTEGER NOT NULL,
    `cursoId` INTEGER NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UsuariosCursos_matricula_key`(`matricula`),
    PRIMARY KEY (`usuarioId`, `cursoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subcategoria` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `areaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Certificado` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tituloAtividade` VARCHAR(191) NOT NULL,
    `cargaHorariaInformada` DOUBLE NOT NULL,
    `dataAtividade` DATETIME(3) NOT NULL,
    `arquivoImagem` VARCHAR(191) NOT NULL,
    `dataEnvio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `alunoId` INTEGER NOT NULL,
    `areaId` INTEGER NOT NULL,
    `cursoId` INTEGER NOT NULL,
    `subcategoriaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Validacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('PENDENTE', 'APROVADO', 'RECUSADO') NOT NULL DEFAULT 'PENDENTE',
    `observacao` TEXT NULL,
    `horasValidadas` DOUBLE NULL,
    `dataValidacao` DATETIME(3) NULL,
    `certificadoId` INTEGER NOT NULL,

    UNIQUE INDEX `Validacao_certificadoId_key`(`certificadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UsuariosCursos` ADD CONSTRAINT `UsuariosCursos_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuariosCursos` ADD CONSTRAINT `UsuariosCursos_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subcategoria` ADD CONSTRAINT `Subcategoria_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `AreaAtividade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificado` ADD CONSTRAINT `Certificado_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificado` ADD CONSTRAINT `Certificado_areaId_fkey` FOREIGN KEY (`areaId`) REFERENCES `AreaAtividade`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificado` ADD CONSTRAINT `Certificado_cursoId_fkey` FOREIGN KEY (`cursoId`) REFERENCES `Curso`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Certificado` ADD CONSTRAINT `Certificado_subcategoriaId_fkey` FOREIGN KEY (`subcategoriaId`) REFERENCES `Subcategoria`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Validacao` ADD CONSTRAINT `Validacao_certificadoId_fkey` FOREIGN KEY (`certificadoId`) REFERENCES `Certificado`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
