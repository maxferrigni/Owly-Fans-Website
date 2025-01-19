// api/subscribe.js
import { Octokit } from '@octokit/rest';

// Initialize GitHub API client
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// GitHub repository details
const REPO_OWNER = 'maxferrigni';
const REPO_NAME = 'Owly-Fans-Motion-Detection';
const FILE_PATH = 'configs/email_recipients.txt';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, captchaAnswer, captchaQuestion } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate captcha
    if (parseInt(captchaAnswer) !== captchaQuestion.answer) {
      return res.status(400).json({ message: 'Invalid captcha' });
    }

    // Get current file content
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
    });

    // Decode current content
    const currentContent = Buffer.from(fileData.content, 'base64').toString();
    
    // Split into array of emails
    const emails = currentContent.split('\n').filter(line => line.trim());

    // Check for duplicate
    if (emails.includes(email.toLowerCase().trim())) {
      return res.status(200).json({ 
        status: 'already-subscribed',
        message: 'Email is already subscribed' 
      });
    }

    // Add new email
    emails.push(email.toLowerCase().trim());

    // Create new content
    const newContent = emails.join('\n');

    // Update file in repository
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: FILE_PATH,
      message: `Add new subscriber: ${email}`,
      content: Buffer.from(newContent).toString('base64'),
      sha: fileData.sha
    });

    // Return success response
    return res.status(200).json({
      status: 'success',
      message: 'Successfully subscribed'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
}
