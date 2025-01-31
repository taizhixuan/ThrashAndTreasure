const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

async function initializeEmailService() {
    console.log('\nInitializing Email Service...');
    
    // Check templates directory
    const templatesDir = path.join(__dirname, '..', 'templates');
    try {
        await fs.access(templatesDir);
        console.log('Templates directory found at:', templatesDir);
    } catch (error) {
        console.error('Templates directory not found! Creating it...');
        await fs.mkdir(templatesDir, { recursive: true });
    }
    
    console.log('SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        secure: false
    });

    try {
        await transporter.verify();
        console.log('SMTP server is ready to take messages');
        return true;
    } catch (error) {
        console.error('SMTP verification failed:', error);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            response: error.response
        });
        return false;
    }
}

async function loadEmailTemplate(templateName) {
    const templatePath = path.join(__dirname, '..', 'templates', templateName);
    console.log('\n=== Loading Email Template ===');
    console.log('Template Path:', templatePath);
    
    try {
        // Check if file exists first
        try {
            await fs.access(templatePath);
            console.log('Template file exists');
        } catch (err) {
            console.error('Template file does not exist!');
            throw new Error(`Email template not found at ${templatePath}`);
        }

        const template = await fs.readFile(templatePath, 'utf8');
        console.log('Template content length:', template.length);
        console.log('Template preview:', template.substring(0, 100) + '...');
        return template;
    } catch (error) {
        console.error('Failed to load email template:', error);
        throw error;
    }
}

async function sendVerificationEmail(to, verificationToken) {
    if (!process.env.BASE_URL) {
        console.error('BASE_URL environment variable is not set');
        throw new Error('BASE_URL configuration missing');
    }

    console.log('\nAttempting to send verification email:', {
        to,
        verificationToken,
        baseUrl: process.env.BASE_URL
    });
    
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    console.log('Generated verification link:', verificationLink);
    
    try {
        // Check if template exists
        const templatePath = path.join(__dirname, '..', 'templates', 'verificationEmail.html');
        console.log('Template path:', templatePath);
        
        if (!fs.existsSync(templatePath)) {
            console.error('Template file does not exist at:', templatePath);
            throw new Error('Email template not found');
        }

        let template = await loadEmailTemplate('verificationEmail.html');
        if (!template) {
            throw new Error('Email template is empty');
        }

        template = template.replace(/{{verificationLink}}/g, verificationLink);
        console.log('Email template loaded and populated');

        const info = await sendEmail({
            to,
            subject: 'Verify your Thrash and Treasure account',
            html: template
        });
        console.log('Verification email sent successfully:', info.messageId);
        return info;
    } catch (error) {
        console.error('Failed to send verification email:', error);
        console.error('Error details:', {
            code: error.code,
            command: error.command,
            response: error.response,
            stack: error.stack
        });
        throw error;
    }
}

async function sendEmail({ to, subject, html }) {
    if (!to || !subject || !html) {
        throw new Error('Missing required email parameters');
    }

    console.log('\n=== Sending Email ===');
    console.log('To:', to);
    console.log('Subject:', subject);
    
    try {
        const info = await transporter.sendMail({
            from: `"Thrash and Treasure" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html
        });
        
        console.log('=== Email Sent Successfully ===');
        console.log('Message ID:', info.messageId);
        return info;
    } catch (error) {
        console.error('=== Email Sending Failed ===');
        console.error('Error Type:', error.name);
        console.error('Error Message:', error.message);
        throw error;
    }
}

module.exports = { 
    sendEmail, 
    sendVerificationEmail,
    initializeEmailService 
}; 