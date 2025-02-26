/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig
