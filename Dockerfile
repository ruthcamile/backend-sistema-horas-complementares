# 1. Usa uma versão super leve e oficial do Node.js
FROM node:20-alpine

# 2. Cria uma pasta de trabalho lá dentro do contêiner
WORKDIR /app

# 3. Copia os arquivos de dependências primeiro (isso deixa o Docker mais rápido)
COPY package*.json ./
COPY prisma ./prisma/

# 4. Instala as dependências do seu projeto
RUN npm install

# 5. Copia todo o resto do seu código para dentro da caixa
COPY . .

# 6. Gera o cliente do Prisma para ele entender o seu banco de dados
RUN npx prisma generate

# 7. Compila o seu TypeScript para JavaScript
# (Atenção: verifique se você tem o script "build" no seu package.json!)
RUN npm run build

# 8. Avisa que a API vai rodar na porta 3000
EXPOSE 3000

# 9. O comando final para ligar o servidor quando a máquina iniciar
# (Atenção: ajuste para o comando que roda o seu JS compilado, ex: node dist/server.js)
CMD ["npm", "start"]