
import { LegalMessage } from '../types';

export const MOCK_LEGAL_RESPONSES: Record<string, Partial<LegalMessage>> = {
  "default": {
    content: "As Lawlify, your elite legal assistant specialized in the East African jurisdiction, I am ready to assist with your query. Please provide specific documents or legal questions related to Kenyan statutes or regional regulations.",
  },
  "conveyancing": {
    content: "### Legal Memo: Conveyancing Requirements under Land Registration Act (2012)\n\nIn accordance with the **Land Registration Act No. 3 of 2012** and the **Land Act (2012)**, the following requirements must be strictly adhered to for a valid transfer of land in Kenya:\n\n1. **Spousal Consent**: Required under Section 93 of the Land Act for any transaction involving matrimonial property.\n2. **Clearances**: Valid Land Rent Clearance Certificate and Land Rates Clearance Certificate from the relevant County Government.\n3. **Valuation**: Assessment by a Government Valuer to determine Stamp Duty (typically 4% for urban and 2% for rural properties).\n4. **Execution**: Documents must be witnessed by an Advocate of the High Court of Kenya.\n\n**Recommendation**: Ensure the search is conducted within 24 hours of the execution of the transfer to mitigate risk of encumbrances.",
    citations: [
      { statute: "Land Registration Act", section: "Section 37", description: "Transfer of land registered under this Act." },
      { statute: "The Land Act", section: "Section 93", description: "Matrimonial property and spousal consent." }
    ]
  },
  "case_explanation": {
    content: "### Case Brief: Muruatetu & Another v Republic (2017)\n\n**Citation**: [2017] eKLR\n**Court**: Supreme Court of Kenya\n\n**Issue**: Whether the mandatory death sentence for murder is unconstitutional.\n\n**Holding**: The Supreme Court held that the mandatory nature of the death sentence as provided under Section 204 of the Penal Code is unconstitutional because it deprives the court of its discretion to consider mitigating factors.\n\n**Impact on Kenyan Law**:\n- Courts now have the discretion to impose sentences other than death.\n- Triggered a massive re-sentencing wave across Kenyan prisons.\n- Reaffirmed the right to a fair trial under Article 50 of the Constitution of Kenya (2010).",
    citations: [
      { statute: "Constitution of Kenya", section: "Article 50", description: "Right to a fair trial." },
      { statute: "Penal Code (Cap 63)", section: "Section 204", description: "Punishment for murder." }
    ]
  }
};
