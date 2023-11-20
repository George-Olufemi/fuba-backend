import MailerService from "./mailer";
import UtilsService from "./utils";

const mailerService: MailerService = new MailerService();
const utilsService: UtilsService = new UtilsService();

class EmailHandlerService {

    public async sendVerificationMail(email: string) {
        const verificationLink = await utilsService.generateVerificationToken(email);
        const emailSubject: string = "Action Required: Verify Your Account"
        const emailBody: string = `
        <div style="margin: 0px; padding: 30px; background: #f8f9fc; height: auto; box-sizing: border-box; line-height: 1.5rem; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;">
            <div class="header" style="height: 80px; background: #280D46; color: white">
                <header style="padding-top: 25px; font-size: 1.9rem; font-weight: 600; text-align: center;">FUBA</header>
            </div>
            <section>
                <div style="font-weight: 400; font-size: 1rem; color: #555555; margin-top: 25px;">
                    <p>Hello,</p>
                </div>
                <div style="font-weight: 400; font-size: 1rem; color: #555555;">
                    <p> Please click the button below to verify your email address.</p>
                </div>
                <div style="text-align: center;">
                    <a href="${verificationLink}" style="text-decoration: none; display: inline-block; background: #280D46; padding: 10px; border-radius: 5px;">
                        <p style="font-weight: 600; font-size: 1rem; color: white; margin: 0;">Verify Email Address</p>
                    </a>
                </div>
                <p style="font-weight: 400; font-size: 1rem; color: #555555;"> If you didn't create an account no futher action is required. </p>
                <div style="font-weight: 200; font-size: 1rem; color: #555555;">
                    <strong><p>Regards,</p></strong>
                    <strong><p>Future Builder Agency</p></strong>
                </div>
                <div style="font-weight: 400; font-size: 0.75rem; color: #555555; text-align: center;">
                    <p> If you are having trouble clicking the <strong>"Verify Email Address"</strong> button above copy and paste the url into your browers: <br />${verificationLink}</p>
                </div>
            </section>
        </div>
        `
        await mailerService.sendVerificationMail(email, emailSubject, emailBody);
        return true;
    }

}

export default EmailHandlerService;