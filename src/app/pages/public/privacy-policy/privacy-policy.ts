import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './privacy-policy.html',
})
export class PublicPrivacyPolicyComponent {
  sections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly, such as when you create an account, complete your profile, or contact us. This includes:
• Personal identification information (name, email, phone number)
• Profile information (skills, experience, availability)
• Payment and billing information
• Communications with us and other users
• Job history and ratings`,
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Process transactions and send related information
• Connect workers with clients based on job requirements
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Monitor and analyze trends, usage, and activities`,
    },
    {
      title: 'Information Sharing',
      content: `We may share your information in the following circumstances:
• With other users as part of the platform's functionality (e.g., sharing worker profiles with clients)
• With vendors, consultants, and service providers who need access to perform services for us
• In response to legal process or government requests
• To protect the rights, property, and safety of Quick Staff, our users, or the public
• In connection with a merger, acquisition, or sale of assets`,
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
• Encryption of data in transit and at rest
• Regular security assessments and audits
• Access controls and authentication measures
• Employee training on data protection practices`,
    },
    {
      title: 'Your Rights and Choices',
      content: `You have certain rights regarding your personal information:
• Access and update your account information at any time
• Request deletion of your personal data
• Opt out of marketing communications
• Request a copy of your data in a portable format
• Object to certain processing of your information`,
    },
    {
      title: 'Cookies and Tracking',
      content:
        `We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings, though disabling them may affect your experience on our platform.`,
    },
    {
      title: "Children's Privacy",
      content:
        `Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will take steps to delete it.`,
    },
    {
      title: 'Changes to This Policy',
      content:
        `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the platform after changes constitutes acceptance of the updated policy.`,
    },
  ];
}

