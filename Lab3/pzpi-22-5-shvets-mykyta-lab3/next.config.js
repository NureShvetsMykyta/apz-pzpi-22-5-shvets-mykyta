// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://localhost:7258/api/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
