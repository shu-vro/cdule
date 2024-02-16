/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { unoptimized: true },
};

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
});

module.exports = withPWA(nextConfig);
