
import React, { useState } from 'react';
import EmailEditor from '../components/EmailEditor';
import { Attachment } from '../components/FileAttachment';
import { Button } from "@/components/ui/button";

const initialEmailContent = `
<p>Dear Aman Singh,</p>
<p>Please review the attached issue for the study Maxis-01. Please take the required action or reply to this email.</p>
<p>Thank you.<br>
Warmest Regard<br>
John Doe.<br>
john29@gmail.com<br>
Powered by Dtect AI by MaxisIT.
</p>
`;

const Index = () => {
  const [showEditor, setShowEditor] = useState(true);
  const [sentEmails, setSentEmails] = useState<{
    subject: string;
    body: string;
    attachments: Attachment[];
    sentAt: Date;
  }[]>([]);

  const handleSendEmail = (content: { subject: string; body: string; attachments: Attachment[] }) => {
    setSentEmails(prev => [
      {
        ...content,
        sentAt: new Date()
      },
      ...prev
    ]);
    setShowEditor(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Composer</h1>
          <p className="text-gray-600">Create beautiful, rich-text emails with ease</p>
        </div>

        {showEditor ? (
          <EmailEditor 
            onSend={handleSendEmail}
            initialSubject="Assigning Query 21."
            initialContent={initialEmailContent}
          />
        ) : (
          <div className="text-center mt-16 space-y-4">
            <div className="text-2xl font-medium text-green-600 mb-2">Email Sent Successfully!</div>
            <p className="text-gray-600">Your email has been sent with {sentEmails[0]?.attachments.length || 0} attachments.</p>
            <Button 
              onClick={() => setShowEditor(true)}
              className="mt-4"
            >
              Compose New Email
            </Button>
          </div>
        )}
        
        {sentEmails.length > 0 && !showEditor && (
          <div className="mt-12 max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Recently Sent</h2>
            <div className="space-y-4">
              {sentEmails.map((email, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{email.subject}</h3>
                    <span className="text-sm text-gray-500">
                      {email.sentAt.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 truncate">
                    {email.attachments.length > 0 && (
                      <span className="text-blue-500">
                        {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
