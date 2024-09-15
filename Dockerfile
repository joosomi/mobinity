# Node.js 18.18.x Alpine 이미지 사용
FROM node:18.18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 파일을 컨테이너로 복사
COPY . .

# 빌드 단계 추가
RUN npm run build

CMD ["npm", "run", "start"]