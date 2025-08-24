"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting database seeding...');
    try {
        // Create default admin user
        const adminEmail = 'admin@visitkazakhstan.com';
        const adminPassword = 'Admin123!'; // Change this in production!
        // Check if admin user already exists
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail },
        });
        if (!existingAdmin) {
            const hashedPassword = await bcryptjs_1.default.hash(adminPassword, 12);
            const admin = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'System Administrator',
                    role: 'SUPER_ADMIN',
                },
            });
            console.log('✅ Created admin user:', admin.email);
            console.log('📧 Email:', adminEmail);
            console.log('🔑 Password:', adminPassword);
            console.log('⚠️  Please change the password after first login!');
        }
        else {
            console.log('👤 Admin user already exists:', existingAdmin.email);
        }
        // Seed default content for homepage
        const defaultContent = [
            {
                page: 'homepage',
                section: 'hero',
                key: 'title',
                type: 'text',
                value: 'Your Next Best Trip, Return Inspired',
            },
            {
                page: 'homepage',
                section: 'hero',
                key: 'subtitle',
                type: 'text',
                value: 'Discover the beauty and culture of Kazakhstan',
            },
            {
                page: 'homepage',
                section: 'why-visit',
                key: 'title',
                type: 'text',
                value: 'Why Visit Kazakhstan',
            },
            {
                page: 'homepage',
                section: 'why-visit',
                key: 'description',
                type: 'rich_text',
                value: 'Kazakhstan is vast and diverse — and so are the ways to experience it. Whether you\'re chasing landscapes, culture, adventure, or spiritual meaning, there\'s a route for every traveler.',
            },
            {
                page: 'about-us',
                section: 'hero',
                key: 'title',
                type: 'text',
                value: 'About Visit Kazakhstan',
            },
            {
                page: 'about-us',
                section: 'content',
                key: 'description',
                type: 'rich_text',
                value: 'Visit Kazakhstan is your gateway to discovering the incredible beauty, rich culture, and endless adventures that await in the heart of Central Asia.',
            },
        ];
        // Get admin user for content creation
        const adminUser = await prisma.user.findFirst({
            where: { role: 'SUPER_ADMIN' },
        });
        if (adminUser) {
            for (const content of defaultContent) {
                await prisma.content.upsert({
                    where: {
                        page_section_key: {
                            page: content.page,
                            section: content.section,
                            key: content.key,
                        },
                    },
                    update: {
                        value: content.value,
                        type: content.type,
                        updatedById: adminUser.id,
                    },
                    create: {
                        page: content.page,
                        section: content.section,
                        key: content.key,
                        type: content.type,
                        value: content.value,
                        updatedById: adminUser.id,
                    },
                });
            }
            console.log('✅ Seeded default content');
        }
        // Create sample blog post
        const samplePost = await prisma.blogPost.upsert({
            where: { slug: 'welcome-to-kazakhstan' },
            update: {},
            create: {
                title: 'Welcome to Kazakhstan: Your Ultimate Travel Guide',
                slug: 'welcome-to-kazakhstan',
                content: `
          <h2>Discover the Heart of Central Asia</h2>
          <p>Kazakhstan, the world's largest landlocked country, offers travelers an incredible blend of ancient traditions and modern innovation. From the futuristic skyline of Nur-Sultan to the timeless beauty of the Silk Road cities, Kazakhstan promises adventures that will leave you inspired.</p>
          
          <h3>Top Destinations</h3>
          <ul>
            <li><strong>Almaty</strong> - The cultural capital with stunning mountain backdrops</li>
            <li><strong>Nur-Sultan</strong> - A futuristic city showcasing modern architecture</li>
            <li><strong>Turkestan</strong> - Ancient Silk Road city with historical significance</li>
            <li><strong>Charyn Canyon</strong> - Kazakhstan's answer to the Grand Canyon</li>
          </ul>
          
          <p>Whether you're seeking adventure in the great outdoors, cultural immersion in ancient cities, or the comfort of modern luxury, Kazakhstan has something for every traveler.</p>
        `,
                excerpt: 'Discover why Kazakhstan should be your next travel destination with our comprehensive guide to the country\'s top attractions and hidden gems.',
                status: 'PUBLISHED',
                featured: true,
                publishedAt: new Date(),
                tags: ['Travel', 'Kazakhstan', 'Adventure', 'Culture'],
                category: 'Travel Guide',
                seoTitle: 'Kazakhstan Travel Guide - Discover Central Asia\'s Hidden Gem',
                seoDescription: 'Complete travel guide to Kazakhstan featuring top destinations, cultural attractions, and adventure activities in Central Asia\'s largest country.',
                readTime: 5,
                authorId: adminUser.id,
            },
        });
        console.log('✅ Created sample blog post:', samplePost.title);
        console.log('🎉 Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map