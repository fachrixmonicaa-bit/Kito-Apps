# Gunakan image Node.js versi 18 Alpine yang sangat ringan dan aman
FROM node:18-alpine

# Menentukan folder kerja di dalam container Docker
WORKDIR /app

# Menyalin file package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan fitur cache Docker agar 'npm install' tidak diulang-ulang jika package.json tidak berubah
COPY package*.json ./

# Menginstal semua dependensi
RUN npm install

# Menyalin semua kode sumber aplikasi dari folder server ke dalam container
COPY . .

# Memberitahu Docker bahwa aplikasi berjalan di port 5000
EXPOSE 5000

# Perintah yang dijalankan saat container dihidupkan
CMD ["npm", "start"]
