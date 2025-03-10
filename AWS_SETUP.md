# Setting Up AWS End User Messaging for SMS

This guide will help you set up AWS Pinpoint for sending SMS messages in your application.

## Prerequisites

- An AWS account
- AWS CLI installed and configured (optional, but helpful)

## Step 1: Create an AWS Pinpoint Project

1. Sign in to the AWS Management Console
2. Navigate to the Amazon Pinpoint service
3. Click "Create a project"
4. Enter a project name (e.g., "sayenly-sms")
5. Click "Create"

## Step 2: Enable SMS Channel

1. In your Pinpoint project, navigate to "Settings" in the left sidebar
2. Click on "SMS and voice"
3. Click "Edit" in the SMS settings section
4. Enable the SMS channel
5. Configure your SMS settings:
   - Choose "Transactional" for default message type
   - Set your spending limit if needed
6. Click "Save changes"

## Step 3: Request a Sender ID or Phone Number (Optional)

For better deliverability and branding:

1. In SMS and voice settings, click on "Phone numbers"
2. Click "Request phone number"
3. Follow the steps to request a dedicated phone number
4. Alternatively, you can request a Sender ID in countries that support it

## Step 4: Set Up IAM Permissions

Create an IAM user with the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "mobiletargeting:SendMessages",
        "mobiletargeting:GetSmsChannel",
        "mobiletargeting:UpdateSmsChannel"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 5: Configure Environment Variables

Add the following variables to your `.env` file:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_PINPOINT_PROJECT_ID=your_pinpoint_project_id
```

Optional configuration:

```
AWS_SENDER_ID=YourSenderID
AWS_ORIGINATION_NUMBER=+12065550100
```

## Testing Your Setup

You can test your SMS setup using the AWS Console:

1. Go to your Pinpoint project
2. Click "Test messaging" in the left sidebar
3. Select "SMS" as the channel
4. Enter a destination phone number
5. Enter a test message
6. Click "Send message"

## Monitoring and Analytics

AWS Pinpoint provides detailed analytics for your SMS campaigns:

1. Go to your Pinpoint project
2. Click "Analytics" in the left sidebar
3. View delivery rates, open rates, and other metrics

## Troubleshooting

- Check CloudWatch Logs for detailed error messages
- Verify that your IAM permissions are correctly set up
- Ensure your phone numbers are in E.164 format (+12065550100)
- Check your AWS account's SMS spending limit
