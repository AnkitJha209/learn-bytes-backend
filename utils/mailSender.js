import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({
    path: './env'
})

export const mailSender = async ({email, title, body}) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        let info = await transporter.sendMail({
            from: "LearnBytes || Ankit Jha",
            to: `${email}`,
            subject:`${title}`,
            html: `${body}`
        })
        console.log(info)
        return info;
    } catch (error) {
        console.log(error.message)
    }
}