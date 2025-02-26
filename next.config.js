/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
      },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'akkarmotors.com.br',
                port: "",
            },
            {
                protocol: 'https',
                hostname: 'hkuzikocskwbvvucobqa.supabase.co',
                port: "",
            },
            {
                protocol: 'https',
                hostname: 'api.imgbb.com',
                port: "",
            }
        ]
    }
}

module.exports = nextConfig;
