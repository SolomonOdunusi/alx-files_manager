const Queue = require('bull');
const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job, done) => {
    const { fileId, userId, filePath } = job.data;
    if (!fileId || !userId || !filePath) {
        return done(new Error('Missing parameters'));
    }

    const sizes = [500, 250, 100];
    try {
        for (const size of sizes) {
            const options = { width: size, responseType: 'buffer' };
            const thumbnail = await imageThumbnail(filePath, options);
            const newFileName = `${filePath}_${size}`;
            fs.writeFileSync(newFileName, thumbnail);
        }
        done();
    } catch (error) {
        done(error);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await fileQueue.close();
    console.log('Worker shutdown completed');
    process.exit(0);
});
