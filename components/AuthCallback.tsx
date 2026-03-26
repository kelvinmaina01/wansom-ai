import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Scale } from 'lucide-react';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Check for Supabase auth session from URL hash
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    throw sessionError;
                }

                if (session) {
                    // Successfully authenticated - redirect to onboarding or home
                    console.log('Auth callback successful:', session.user);

                    // Initialize user in backend
                    try {
                        const token = session.access_token;
                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/init`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        
                        if (!response.ok) {
                            console.error('Failed to initialize user in backend');
                        } else {
                            const initData = await response.json();
                            console.log('User initialized in backend:', initData);
                        }
                    } catch (initErr) {
                        console.error('Error calling user init:', initErr);
                    }

                    // Check if user has completed onboarding (you can add this check)
                    // For now, redirect to home/dashboard
                    navigate('/onboarding', { replace: true });
                } else {
                    // No session found - redirect to auth page
                    console.log('No session found, redirecting to auth');
                    navigate('/auth', { replace: true });
                }
            } catch (err: any) {
                console.error('Auth callback error:', err);
                setError(err.message || 'Authentication failed');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Scale className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Authentication Failed</h1>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-hover transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Scale className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Signing you in...</h1>
                <p className="text-gray-400">Please wait while we complete the authentication.</p>
            </div>
        </div>
    );
};

export default AuthCallback;
