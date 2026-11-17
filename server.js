import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// API Endpoint for Booking Demo
app.post('/api/demo', async (req, res) => {
    const { firstName, lastName, email, company, message } = req.body;

    if (!email || !firstName) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // 1. Send notification to Nexspace team
        const adminEmail = resend.emails.send({
            from: 'Nexspace Demo <system@nexspace.app>',
            to: ['system@nexspace.app'],
            subject: `New Demo Request: ${firstName} ${lastName} from ${company}`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.5; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background: #060d1a; padding: 24px; text-align: center;">
                        <img src="https://nexspace.app/logo.png" alt="Nexspace Logo" style="height: 32px; width: auto;">
                    </div>
                    <div style="padding: 32px;">
                        <h2 style="color: #1E8DE7; margin-top: 0;">New Nexspace Demo Request</h2>
                        <p><strong>First Name:</strong> ${firstName}</p>
                        <p><strong>Last Name:</strong> ${lastName}</p>
                        <p><strong>Work Email:</strong> ${email}</p>
                        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
                        <p><strong>Solution needed:</strong></p>
                        <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
                            ${message || 'No additional message provided.'}
                        </div>
                    </div>
                </div>
            `,
        });

        // 2. Send confirmation to the user
        const userEmail = resend.emails.send({
            from: 'Nexspace Sales <sales@nexspace.app>',
            to: [email],
            reply_to: 'system@nexspace.app',
            subject: `Thanks for your interest in Nexspace, ${firstName}!`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background: #060d1a; padding: 24px; text-align: center;">
                        <img src="https://nexspace.app/logo.png" alt="Nexspace Logo" style="height: 32px; width: auto;">
                    </div>
                    <div style="padding: 32px;">
                        <h2 style="color: #1E8DE7; margin-top: 0;">Hello ${firstName},</h2>
                        <p>Thank you for reaching out to Nexspace! We've received your request for a demo of our platform.</p>
                        <p>Our team is reviewing your requirements and one of our experts will be in touch shortly to schedule a session that works for you.</p>
                        <div style="background: #f8fafc; border-left: 4px solid #1E8DE7; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">What's next?</p>
                            <p style="margin: 5px 0 0 0;">Keep an eye on your inbox—we usually respond within 2-4 business hours.</p>
                        </div>
                        <p>In the meantime, feel free to visit our <a href="https://nexspace.app" style="color: #1E8DE7; text-decoration: none; font-weight: 600;">website</a> to learn more about our platform.</p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="font-size: 0.9rem; color: #666;">Best regards,<br>The Nexspace Team</p>
                    </div>
                </div>
            `,
        });

        const [adminResult, userResult] = await Promise.all([adminEmail, userEmail]);

        if (adminResult.error || userResult.error) {
            console.error('Resend error:', adminResult.error || userResult.error);
            return res.status(400).json({ error: adminResult.error || userResult.error });
        }

        res.status(200).json({ success: true, data: { adminResult, userResult } });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
