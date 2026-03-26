import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith('re_') 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

const LAWLIFY_LOGO_SVG = `
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="24" rx="6" fill="#ef4444"/>
  <path d="M12 6L7 11V18H17V11L12 6Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M9 18V13H15V18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export const sendWelcomeEmail = async (userEmail, displayName) => {
  if (!resend) {
    console.warn('RESEND_API_KEY is missing or invalid. Skipping welcome email for:', userEmail);
    return { success: true, data: { status: 'skipped' } };
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'Lawlify AI <welcome@lawlify.ai>',
      to: [userEmail],
      subject: 'Welcome to the Future of Law, ' + displayName + '!',
      reply_to: 'support@lawlify.ai',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Lawlify AI</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #050505;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #ffffff;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #050505;
      padding-bottom: 60px;
    }
    .main {
      background-color: #0a0a0a;
      margin: 0 auto;
      width: 100%;
      max-width: 600px;
      border-spacing: 0;
      font-family: sans-serif;
      color: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      margin-top: 40px;
    }
    .header {
      padding: 40px 0 20px 0;
      text-align: center;
    }
    .content {
      padding: 0 40px 40px 40px;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -0.05em;
      margin-bottom: 24px;
      line-height: 1.2;
    }
    .text-red { color: #ef4444; }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #a3a3a3;
      margin-bottom: 24px;
    }
    .feature-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 16px;
    }
    .feature-title {
      color: #ffffff;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .cta-button {
      display: inline-block;
      background-color: #ffffff;
      color: #000000;
      padding: 16px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-size: 14px;
      font-weight: 800;
      margin-top: 20px;
      transition: transform 0.2s;
    }
    .footer {
      text-align: center;
      padding: 40px;
      font-size: 12px;
      color: #525252;
    }
    .glass {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0) 100%);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <center>
      <table class="main">
        <tr>
          <td class="header glass">
            ${LAWLIFY_LOGO_SVG}
            <div style="margin-top: 20px; font-weight: 900; letter-spacing: 0.2em; text-transform: uppercase; font-size: 12px; color: #ef4444;">Lawlify AI</div>
          </td>
        </tr>
        <tr>
          <td class="content">
            <h1>Welcome to the <br/><span class="text-red">Future of Law</span>, ${displayName}</h1>
            <p>We're thrilled to have you join our elite community of legal professionals scaling their impact with AGI-powered intelligence.</p>
            
            <div class="feature-card">
              <div class="feature-title">The Lawlify Goal</div>
              <p style="margin-bottom: 0; font-size: 14px;">Our mission is to democratize high-end legal intelligence, enabling you to automate workfows, analyze complex cases in seconds, and scale your expertise across borders.</p>
            </div>

            <div class="feature-card">
              <div class="feature-title">Top Features</div>
              <ul style="color: #a3a3a3; font-size: 14px; padding-left: 20px; margin: 0;">
                <li style="margin-bottom: 8px;"><b>Legal Specialists:</b> Deploy specialized AI agents for practice-specific tasks.</li>
                <li style="margin-bottom: 8px;"><b>Judicial Analytics:</b> Predict outcomes based on judge tendencies.</li>
                <li style="margin-bottom: 0;"><b>Agentic Drafting:</b> Collaborate with AI to craft precise legal documents.</li>
              </ul>
            </div>

            <center>
              <a href="https://lawlify-ai.vercel.app/app/legal-ai" class="cta-button">Launch Your Command Center</a>
            </center>
            
            <p style="margin-top: 40px; font-size: 13px; font-style: italic; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px;">
              <b>Need anything?</b> Just reply to this email. We love hearing your feedback and ideas for improvement.
            </p>
          </td>
        </tr>
      </table>
      <div class="footer">
        &copy; 2026 Lawlify Intelligence Systems. All rights reserved.<br/>
        Nairobi, Kenya &bull; Leveling the Legal Playing Field.
      </div>
    </center> center>
  </div>
</body>
</html>
      `
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Exception in sendWelcomeEmail:', err);
    return { success: false, error: err.message };
  }
};
