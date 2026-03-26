/**
 * FollowupGenerator
 * Generates structured questions for missing context fields.
 */
export class FollowupGenerator {
    constructor() {
        this.questionMap = {
            contract_type: {
                text: "What type of contract do you need to draft?",
                type: "choice",
                options: ["NDA / Confidentiality", "Freelance / Service", "Employment", "Partnership", "Lease / Rental"]
            },
            jurisdiction: {
                text: "Which country or jurisdiction does this apply to?",
                type: "choice",
                options: ["Kenya", "Uganda", "Tanzania", "United Kingdom", "South Africa", "Other"]
            },
            party_1: {
                text: "Who is the first party (e.g., your name or company)?",
                type: "text",
                placeholder: "e.g. Acme Corp Ltd"
            },
            party_2: {
                text: "Who is the second party involved?",
                type: "text",
                placeholder: "e.g. John Doe"
            },
            purpose: {
                text: "What is the primary objective of this agreement?",
                type: "text",
                placeholder: "e.g. To protect software source code during a pilot"
            },
            legal_area: {
                text: "Which area of law does your question fall under?",
                type: "choice",
                options: ["Employment", "Property / Land", "Family / Divorce", "Criminal", "Commercial / Business"]
            },
            situation_description: {
                text: "Could you provide more details about the situation?",
                type: "text",
                placeholder: "Be as specific as possible regarding dates and events."
            },
            case_reference: {
                text: "What is the name or citation of the case you are analyzing?",
                type: "text",
                placeholder: "e.g. Muruatetu Case"
            }
        };
    }

    generate(missingFields) {
        if (!missingFields || missingFields.length === 0) return null;

        const questions = missingFields.map(field => {
            const fieldId = field.id || field;
            const config = this.questionMap[fieldId];
            return {
                id: fieldId,
                text: config?.text || `Please provide info for ${field.label || field}`,
                type: config?.type || "text",
                options: config?.options,
                placeholder: config?.placeholder
            };
        });

        // PROGRESSIVE SYSTEM: Focus on the most critical missing info first
        return {
            questions: questions.slice(0, 2), // Ask max 2 questions to reduce friction
            currentIndex: 0,
            total: questions.length
        };
    }
}

export const followupGenerator = new FollowupGenerator();
