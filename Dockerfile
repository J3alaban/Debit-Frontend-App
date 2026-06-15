# Stage 1: Build
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Build dosyalarını kopyala (Vite genelde 'dist' klasörüne build eder)
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx ayarını tek satırda ve hatasız oluşturalım
RUN printf "server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files \$uri \$uri/ /index.html; \n\
    } \n\
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
