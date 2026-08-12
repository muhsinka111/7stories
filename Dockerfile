# 7stories — pinned to Node 22 (Next.js 16 requires >=20.9)
FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci || npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
