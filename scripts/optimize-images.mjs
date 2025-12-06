
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Configuration
const QUALITY = 80;
const FORMATS_TO_PROCESS = ['.png', '.jpg', '.jpeg'];

const getFiles = (dir) => {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
};

const optimizeImages = async () => {
    console.log('Starting image optimization...');
    const files = getFiles(PUBLIC_DIR);

    let processedCount = 0;
    let savedBytes = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (!FORMATS_TO_PROCESS.includes(ext)) continue;

        try {
            const originalBuffer = fs.readFileSync(file);
            const originalSize = originalBuffer.length;

            // Only process if it hasn't been processed?
            // For now, we just re-process. In a real scenario, we might check metadata or a lockfile.
            // But sharp is smart.
            // However, re-compressing already compressed images is bad.
            // So we will only compress if we can actually save space.

            let sharpInstance = sharp(originalBuffer);

            if (ext === '.png') {
                sharpInstance = sharpInstance.png({ quality: QUALITY, compressionLevel: 9, adaptiveFiltering: true });
            } else if (ext === '.jpg' || ext === '.jpeg') {
                sharpInstance = sharpInstance.jpeg({ quality: QUALITY, mozjpeg: true });
            }

            const optimizedBuffer = await sharpInstance.toBuffer();
            const optimizedSize = optimizedBuffer.length;

            if (optimizedSize < originalSize) {
                fs.writeFileSync(file, optimizedBuffer);
                const saved = originalSize - optimizedSize;
                savedBytes += saved;
                console.log(`Optimized: ${path.relative(PUBLIC_DIR, file)} (-${(saved / 1024).toFixed(2)} KB)`);
                processedCount++;
            } else {
                // console.log(`Skipped: ${path.relative(PUBLIC_DIR, file)} (No improvement)`);
            }

        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    console.log('-----------------------------------');
    console.log(`Optimization complete!`);
    console.log(`Processed: ${processedCount} files`);
    console.log(`Total saved: ${(savedBytes / 1024 / 1024).toFixed(2)} MB`);
};

optimizeImages().catch(console.error);
