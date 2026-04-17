import React, { useEffect, useState } from 'react';
import API_URL from '../../api/config';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import ATSScannerHero from './ATSScannerHero';
import ATSScannerForm from './ATSScannerForm';
import ATSScannerResults from './ATSScannerResults';

const ATSScanner = () => {
    const location = useLocation();
    const [jobDescription, setJobDescription] = useState('');
    const [file, setFile] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
            if (location.state.jobDescription) {
                setJobDescription(location.state.jobDescription);
            }
        }
    }, [location.state]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError('');
    };

    const handleScan = async () => {
        if (!file) {
            setError('Please upload a resume first.');
            return;
        }

        if (!jobDescription.trim()) {
            setError('Please enter a job description to scan against.');
            return;
        }

        setScanning(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_URL}/api/scan`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Scan failed');
            }

            setResult(data);
        } catch (scanError) {
            console.error(scanError);
            setError(scanError.message);
        } finally {
            setScanning(false);
        }
    };

    const resultQuestions = result?.interviewQuestions || [];
    const resultAttentionMap = result?.attentionMap || [];
    const resultRoleRecommendations = result?.roleRecommendations || [];

    return (
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-500 ease-in-out">
            <Navbar />

            {/* Premium Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[130px]" />
                <div className="absolute bottom-[-20%] left-[-10%] h-[800px] w-[800px] rounded-full bg-cyan-500/10 blur-[130px]" />
                
                {/* Subtle Grid Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black,transparent_90%)]" 
                     style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23888' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
            </div>

            <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 md:pt-36 pb-20">
                <ATSScannerHero />
                
                <div className="mt-12">
                    <ATSScannerForm
                        file={file}
                        jobDescription={jobDescription}
                        scanning={scanning}
                        error={error}
                        onFileChange={handleFileChange}
                        onJobDescriptionChange={setJobDescription}
                        onScan={handleScan}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {result && (
                        <div className="mt-16 animate-in fade-in slide-in-from-top-10 duration-1000">
                            <ATSScannerResults
                                result={result}
                                questions={resultQuestions}
                                attentionMap={resultAttentionMap}
                                roleRecommendations={resultRoleRecommendations}
                            />
                        </div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

export default ATSScanner;
