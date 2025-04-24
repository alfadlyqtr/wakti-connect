
import { supabase } from '@/integrations/supabase/client';

interface PublicKeyCredentialCreationOptionsJSON {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: { alg: number; type: 'public-key' }[];
  timeout: number;
  attestation: 'direct' | 'indirect' | 'none';
  authenticatorSelection: {
    authenticatorAttachment?: 'platform' | 'cross-platform';
    requireResidentKey?: boolean;
    userVerification?: 'required' | 'preferred' | 'discouraged';
  };
}

export async function startBiometricRegistration(userId: string, email: string): Promise<boolean> {
  try {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn is not supported in this browser');
    }

    // Create credential options
    const options: PublicKeyCredentialCreationOptionsJSON = {
      challenge: Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16)).join(''),
      rp: {
        name: 'WAKTI',
        id: window.location.hostname
      },
      user: {
        id: userId,
        name: email,
        displayName: email
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' }, // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      timeout: 60000,
      attestation: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: false,
        userVerification: 'preferred'
      }
    };

    // Create credential
    const credential = await navigator.credentials.create({
      publicKey: {
        ...options,
        challenge: Uint8Array.from(options.challenge, c => c.charCodeAt(0)),
        user: {
          ...options.user,
          id: Uint8Array.from(options.user.id, c => c.charCodeAt(0))
        }
      }
    }) as PublicKeyCredential;

    if (!credential) {
      throw new Error('Failed to create credential');
    }

    // Store credential in database
    const { error } = await supabase.from('biometric_credentials').insert({
      user_id: userId,
      credential_id: btoa(String.fromCharCode(...new Uint8Array((credential.rawId)))),
      public_key: btoa(String.fromCharCode(...new Uint8Array((credential as any).response.getPublicKey()))),
      nickname: 'Primary Device'
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error registering biometric credential:', error);
    return false;
  }
}

export async function verifyBiometricLogin(email: string): Promise<{ user: any; session: any } | null> {
  try {
    // Get user's credentials
    const { data: credentials, error: fetchError } = await supabase
      .from('biometric_credentials')
      .select('credential_id, public_key, user_id')
      .eq('user_id', email)
      .single();

    if (fetchError || !credentials) {
      throw new Error('No biometric credentials found');
    }

    // Create assertion options
    const challenge = Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16)).join('');
    
    // Fix for TS type issue: Correctly type the assertion options
    // Note the proper typing of authenticatorTransport
    const assertionOptions: PublicKeyCredentialRequestOptions = {
      challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
      allowCredentials: [{
        type: 'public-key',
        id: Uint8Array.from(atob(credentials.credential_id), c => c.charCodeAt(0)),
        transports: ['internal'] as AuthenticatorTransport[]
      }],
      timeout: 60000,
      userVerification: 'preferred'
    };

    // Get assertion
    const assertion = await navigator.credentials.get({
      publicKey: assertionOptions
    });

    if (!assertion) {
      throw new Error('Failed to get assertion');
    }

    // Verify with Supabase (using email link as fallback)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: challenge // Use challenge as one-time password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error verifying biometric login:', error);
    return null;
  }
}
