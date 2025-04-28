# Stage 1: Cài đặt và build
FROM node:18-alpine AS build

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Sao chép và cài đặt các phụ thuộc
COPY package*.json ./
RUN apk add --no-cache git python3 make g++ tzdata && \
    yarn install --frozen-lockfile && \
    yarn cache clean

# Thiết lập múi giờ
ENV TZ="Asia/Ho_Chi_Minh"

# Sao chép mã nguồn và build
COPY . .
RUN yarn run build

# Stage 2: Runtime
FROM node:18-alpine AS runtime

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV TZ="Asia/Ho_Chi_Minh"

# Chỉ sao chép những file cần thiết từ giai đoạn build
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./

# Lệnh khởi động ứng dụng
CMD ["node", "dist/main"]
