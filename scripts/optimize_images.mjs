
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');
const TARGET_DIRS = ['Story', 'Character', 'CharacterWholeBody'];

async function optimizeImages() {
    console.log('Starting image optimization...');

    for (const dirName of TARGET_DIRS) {
        const dirPath = path.join(PUBLIC_DIR, dirName);
        if (!fs.existsSync(dirPath)) {
            console.warn(`Directory not found: ${dirPath}`);
            continue;
        }

        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            if (!file.toLowerCase().endsWith('.png')) continue;

            const inputPath = path.join(dirPath, file);
            const outputPath = path.join(dirPath, file.replace(/\.png$/i, '.webp'));

            // Check if webp already exists (optional: skip if exists? for now overwrite)

            try {
                console.log(`Optimizing: ${file}...`);
                await sharp(inputPath)
                    .resize(1920, null, { // Max width 1920, auto height
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                const inputStats = fs.statSync(inputPath);
                const outputStats = fs.statSync(outputPath);
                const savings = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);

                console.log(`✅ Generated ${path.basename(outputPath)} (${(outputStats.size / 1024).toFixed(1)}KB) - Saved ${savings}%`);
            } catch (err) {
                console.error(`❌ Failed to optimize ${file}:`, err);
            }
        }
    }
    console.log('Optimization complete!');
}

optimizeImages();
