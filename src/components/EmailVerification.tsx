import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email?: string;
  onVerificationComplete?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ 
  email, 
  onVerificationComplete 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const resendVerificationEmail = async () => {
    if (!email || !supabase) return;

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        toast({
          title: "Failed to resend email",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Verification email sent!",
          description: "Please check your email for the confirmation link."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Check Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to your email address
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {email && (
          <Alert>
            <Mail className="h-4 w-4" />
            <AlertDescription>
              <strong>Email sent to:</strong> {email}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p>To complete your registration:</p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>Open your email inbox</li>
            <li>Look for an email from RentHub</li>
            <li>Click the "Confirm your email" link</li>
            <li>Return here to login</li>
          </ol>
        </div>

        {emailSent && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription className="text-green-700">
              New verification email sent! Please check your inbox.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            onClick={resendVerificationEmail}
            disabled={isResending}
            variant="outline"
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend verification email
              </>
            )}
          </Button>

          {onVerificationComplete && (
            <Button
              onClick={onVerificationComplete}
              className="w-full"
            >
              I've verified my email
            </Button>
          )}
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Can't find the email?</strong> Check your spam folder or try using a different email address.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;