
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Fingerprint } from 'lucide-react';
import { startBiometricRegistration } from '@/lib/webauthn';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const BiometricSetup = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();

  const handleSetupBiometrics = async () => {
    if (!user?.email) {
      toast({
        title: "Error",
        description: "User email not found",
        variant: "destructive"
      });
      return;
    }

    setIsRegistering(true);
    try {
      const success = await startBiometricRegistration(user.id, user.email);
      if (success) {
        toast({
          title: "Success",
          description: "Biometric authentication has been set up successfully"
        });
      } else {
        throw new Error("Failed to register biometric credentials");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set up biometric authentication",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Fingerprint className="w-12 h-12 mx-auto mb-4 text-wakti-navy" />
        <h2 className="text-2xl font-bold text-wakti-navy">Biometric Authentication</h2>
        <p className="text-sm text-muted-foreground">
          Set up biometric login to quickly access your account using your device's fingerprint or face recognition.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">Benefits:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Quick and secure login</li>
            <li>No need to remember passwords</li>
            <li>Enhanced account security</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full"
          onClick={handleSetupBiometrics}
          disabled={isRegistering}
        >
          {isRegistering ? "Setting up..." : "Set Up Biometric Login"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BiometricSetup;
