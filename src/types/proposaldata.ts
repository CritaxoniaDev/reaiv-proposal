export type ProposalData = {
    otp: {
        id: string;
        code: string;
        client_name: string;
        expires_at: string;
    };
    proposal: {
        title: string;
        client_name: string;
        overview: string;
        overview_details?: {
            title: string;
            description: string;
            items: { label: string; text: string }[];
        };
        hero: {
            headline: string;
            subtitle: string;
            highlights: ({ title: string; desc: string } | string)[];
        };
        solutions: {
            title: string;
            description: string;
            bullets: string[];
            benefit?: string;
        }[];
        migration_process: {
            step: string;
            description: string;
        }[];
        timelines: {
            title: string;
            steps: { label: string; desc: string }[];
        }[];
        logo_base64?: string;
        price_basic?: string; // Added this
        price_premium?: string; // Added this
    };
};