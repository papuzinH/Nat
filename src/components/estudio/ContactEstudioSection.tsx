import React from "react";
import BookingForm from "./BookingForm";
import EstudioFAQ from "./EstudioFAQ";

const ContactEstudioSection: React.FC = () => (
    <section className="px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-7xl mx-auto">
            <BookingForm />
            <EstudioFAQ />
        </div>
    </section>
);


export default ContactEstudioSection;
