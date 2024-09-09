import { mailtrapClient, sender } from "../mail/mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "../mail/emailTemplates.js";



export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification"
        })
        console.log("Email sent successfully", response)
    } catch (error) {
        console.log("Error sending verification email", error)

        throw new Error(`Failed to send verification email:${error.message}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "d484e333-db4c-434d-b698-b5a8996edd47",
            template_variables: {
                company_info_name: "Larem De Tech",
                name,
            },

        })
        console.log(" Welcome Email sent successfully", response)
    } catch (error) {
        console.log("Error sending Welcome email", error)

        throw new Error(`Failed to send Welcome email:${error.message}`);
    }


}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset"
        })


    } catch (error) {
        console.log("Error sending password reset email", error)

        throw new Error(`Failed to send password reset email:${error.message}`);
    }
}


export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        })
        console.log("Password Reset Email sent successfully", response)
    } catch (error) {
        console.log("Error sending password reset email", error)

        throw new Error(`Failed to send password reset email:${error.message}`);
    }
};