import { judicialIntelligence } from '../services/judicialIntelligence.js';
import logger from '../utils/logger.js';

async function main() {
    try {
        logger.info("Starting Judicial Intelligence Seeding...");
        const result = await judicialIntelligence.seedJudges();
        logger.info(result.message);
        process.exit(0);
    } catch (error) {
        logger.error("Seeding failed:", error);
        process.exit(1);
    }
}

main();
