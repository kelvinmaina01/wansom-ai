/**
 * ContextManager
 * Manages required fields for different legal intents and checks for gaps.
 */
export class ContextManager {
    constructor() {
        this.schemas = {
            draft_contract: [
                { id: 'contract_type', label: 'Contract Type', required: true },
                { id: 'jurisdiction', label: 'Jurisdiction', required: true },
                { id: 'party_1', label: 'First Party', required: true },
                { id: 'party_2', label: 'Second Party', required: true },
                { id: 'purpose', label: 'Objective/Purpose', required: true }
            ],
            legal_advice: [
                { id: 'jurisdiction', label: 'Jurisdiction', required: true },
                { id: 'legal_area', label: 'Legal Area', required: true, options: ['Employment', 'Property', 'Family', 'Criminal', 'Commercial'] },
                { id: 'situation_description', label: 'Situation Details', required: true }
            ],
            case_analysis: [
                { id: 'jurisdiction', label: 'Jurisdiction', required: true },
                { id: 'case_reference', label: 'Case Name or Citation', required: true }
            ]
        };
    }

    getMissingFields(intent, context = {}) {
        const schema = this.schemas[intent] || [];
        return schema.filter(field => !context[field.id]);
    }

    getSchema(intent) {
        return this.schemas[intent] || [];
    }
}

export const contextManager = new ContextManager();
