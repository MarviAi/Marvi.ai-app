import * as SibApiV3Sdk from 'sib-api-v3-sdk';
import { config } from '../config/env';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = config.brevoApiKey;

const apiInstance = new SibApiV3Sdk.ContactsApi();
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

export const addToWaitlist = async (firstName: string, lastName: string, email: string, message: string = '') => {
  const createContact = new SibApiV3Sdk.CreateContact();

  createContact.email = email;
  createContact.attributes = {
    FIRSTNAME: firstName,
    LASTNAME: lastName,
    MESSAGE: message
  };
  createContact.listIds = [3];
  createContact.updateEnabled = true;

  try {
    const data = await apiInstance.createContact(createContact);
    console.log('Contact added or updated successfully in Brevo. Returned data: ' + JSON.stringify(data));

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email: 'info@marvi.ai' }];
    sendSmtpEmail.subject = 'New Waitlist Subscription';
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h2>New Waitlist Subscription</h2>
          <p><strong>First Name:</strong> ${firstName}</p>
          <p><strong>Last Name:</strong> ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { name: 'MARVI Waitlist', email: 'noreply@marvi.ai' };

    const emailResponse = await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent to info@marvi.ai. Response:', emailResponse);

    return true;
  } catch (error) {
    if (error.response && error.response.text) {
      const responseBody = JSON.parse(error.response.text);
      if (responseBody.code === 'duplicate_parameter') {
        console.log('Contact already exists in the waitlist.');
        return true;
      }
      console.error('API error:', responseBody);
    } else {
      console.error('Error adding contact or sending email:', error);
    }
    return false;
  }
};