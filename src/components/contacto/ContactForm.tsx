import React from 'react';
import FormContainer from './FormContainer';

const ContactForm: React.FC = () => {
    return (
        <div className="w-full max-w-lg">
            <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 md:p-8">
                <FormContainer />
            </div>
        </div>
    );
};

export default ContactForm;
