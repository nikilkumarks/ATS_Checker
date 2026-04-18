import React, { useEffect, useState } from 'react';
import API_URL from '../../api/config';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '../../components/Navbar';
import BackNavigation from '../../components/BackNavigation';
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
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
            <Navbar />

            <div className="relative z-10 mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 xl:px-12 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 lg:pb-24">
                <div className="mb-6 sm:mb-8">
                    <BackNavigation label="Back" fallbackTo="/dashboard" />
                </div>

                <ATSScannerHero />
                
                <div className="mt-10 sm:mt-12">
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
                        <div className="mt-12 sm:mt-16 animate-in fade-in slide-in-from-top-10 duration-1000">
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
