import React from "react";
import BookingForm from "./BookingForm";
import EstudioFAQ from "./EstudioFAQ";
import { SectionContainer } from "../shared";

const ContactEstudioSection: React.FC = () => (
    <SectionContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
            <BookingForm />
            <EstudioFAQ />
        </div>
    </SectionContainer>
);


export default ContactEstudioSection;
