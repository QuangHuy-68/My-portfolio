const nodemailer = require('nodemailer');

module.exports = async (req, res) => {

    // 1. Chỉ cho phép POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    // 2. Nhận dữ liệu từ script.js
    const { name, email, message } = req.body;

    // 3. Kiểm tra dữ liệu
    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'All fields are required.'
        });
    }

    // 4. Tạo kết nối Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // 5. Tạo email
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.RECEIVER,

        // Khi bạn bấm Reply trong Gmail
        // sẽ reply về email của người contact
        replyTo: email,

        subject: `📬 Portfolio contact from ${name}`,

        text: `
Name: ${name}
Email: ${email}

Message:
${message}
        `
    };

    // 6. Gửi email
    try {

        await transporter.sendMail(mailOptions);

        // 7. Trả kết quả về frontend
        return res.status(200).json({
            success: true,
            message: 'Email sent successfully!'
        });

    } catch (error) {

        console.error('Email error:', error);

        return res.status(500).json({
            success: false,
            error: 'Failed to send email. Please try again.'
        });
    }
};