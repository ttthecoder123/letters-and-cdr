// STATIC DATA CONFIGURATION
// Extract ALL hardcoded data from every file to eliminate repetition

const STATIC_DATA = {
    courts: [
        'Balmain Local Court',
        'Bankstown Local Court',
        'Blacktown Local Court',
        'Burwood Local Court',
        'Campbelltown District Court',
        'Campbelltown Local Court',
        'Downing Centre District Court',
        'Downing Centre Local Court',
        'Fairfield Local Court',
        'Hornsby Local Court',
        'Liverpool Local Court',
        'Manly Local Court',
        'Newtown Local Court',
        'Parramatta District Court',
        'Parramatta Local Court',
        'Penrith District Court',
        'Penrith Local Court',
        'Sutherland Local Court',
        'Sydney District Court',
        'Waverley Local Court'
    ],
    
    charges: {
        violence: [
            { id: 'affray', value: 'Affray - s93C Crimes Act', section: 's93C', act: 'Crimes Act' },
            { id: 'assault', value: 'Common Assault - s61 Crimes Act', section: 's61', act: 'Crimes Act' },
            { id: 'abh', value: 'Assault occasioning ABH - s59 Crimes Act', section: 's59', act: 'Crimes Act' },
            { id: 'assault_police', value: 'Assault Police - s60 Crimes Act', section: 's60', act: 'Crimes Act' },
            { id: 'resist', value: 'Resist Officer - s58 Crimes Act', section: 's58', act: 'Crimes Act' },
            { id: 'hinder', value: 'Hinder Officer - s546C Crimes Act', section: 's546C', act: 'Crimes Act' }
        ],
        domestic: [
            { id: 'breach_avo', value: 'Breach AVO - s14 CDPV Act', section: 's14', act: 'CDPV Act' },
            { id: 'stalk', value: 'Stalk/Intimidate - s13 CDPV Act', section: 's13', act: 'CDPV Act' },
            { id: 'destroy', value: 'Destroy/Damage Property - s195 Crimes Act', section: 's195', act: 'Crimes Act' },
            { id: 'threaten', value: 'Use Carriage Service to Menace/Harass - s474.17 Criminal Code', section: 's474.17', act: 'Criminal Code' }
        ],
        traffic: [
            { id: 'low_pca', value: 'Low Range PCA - s110(3) Road Transport Act', section: 's110(3)', act: 'Road Transport Act' },
            { id: 'mid_pca', value: 'Mid Range PCA - s110(4) Road Transport Act', section: 's110(4)', act: 'Road Transport Act' },
            { id: 'high_pca', value: 'High Range PCA - s110(5) Road Transport Act', section: 's110(5)', act: 'Road Transport Act' },
            { id: 'disqualified', value: 'Drive whilst disqualified - s54(1) Road Transport Act', section: 's54(1)', act: 'Road Transport Act' },
            { id: 'suspended', value: 'Drive whilst suspended - s54(1) Road Transport Act', section: 's54(1)', act: 'Road Transport Act' },
            { id: 'unlicensed', value: 'Drive unlicensed - s53 Road Transport Act', section: 's53', act: 'Road Transport Act' },
            { id: 'exceed_speed', value: 'Exceed Speed Limit - s20 Road Transport Act', section: 's20', act: 'Road Transport Act' },
            { id: 'negligent', value: 'Negligent Driving - s117 Road Transport Act', section: 's117', act: 'Road Transport Act' }
        ],
        drug: [
            { id: 'possess', value: 'Possess Prohibited Drug - s10 DMTA', section: 's10', act: 'DMTA' },
            { id: 'supply', value: 'Supply Prohibited Drug - s25 DMTA', section: 's25', act: 'DMTA' },
            { id: 'use', value: 'Use Prohibited Drug - s11 DMTA', section: 's11', act: 'DMTA' },
            { id: 'implements', value: 'Possess Drug Implements - s11A DMTA', section: 's11A', act: 'DMTA' }
        ],
        property: [
            { id: 'larceny', value: 'Larceny - s117 Crimes Act', section: 's117', act: 'Crimes Act' },
            { id: 'goods', value: 'Goods in Custody - s527C Crimes Act', section: 's527C', act: 'Crimes Act' },
            { id: 'break_enter', value: 'Break Enter & Steal - s112 Crimes Act', section: 's112', act: 'Crimes Act' },
            { id: 'fraud', value: 'Fraud - s192E Crimes Act', section: 's192E', act: 'Crimes Act' }
        ],
        public_order: [
            { id: 'behave_offensive', value: 'Behave in offensive manner - s4 SOA', section: 's4', act: 'SOA' },
            { id: 'language', value: 'Use offensive language - s4A SOA', section: 's4A', act: 'SOA' },
            { id: 'fail_move', value: 'Fail to move on - s197 LEPR', section: 's197', act: 'LEPR' },
            { id: 'custody', value: 'Custody of knife - s11C SOA', section: 's11C', act: 'SOA' }
        ]
    },
    
    advoConditions: [
        { num: 1, text: 'Mandatory orders (prohibiting violence, threats, stalking, intimidation, harassment and destruction of property)', mandatory: true },
        { num: 2, text: 'The defendant must not contact the protected person in any way, except through the defendant\'s legal representative', id: 'advo_2' },
        { num: 3, text: 'The defendant must not approach, contact or remain within 12 hours of any school, pre-school or childcare facility attended by any protected person under the age of 16 years', id: 'advo_3' },
        { num: 4, text: 'The defendant must not approach or contact the protected person while under the influence of alcohol or illicit drugs', id: 'advo_4' },
        { num: 5, text: 'The defendant must not locate or attempt to locate the protected person', id: 'advo_5' },
        { num: 6, text: 'The defendant may only contact the protected person through the defendant\'s legal representative for the purpose of conducting legal proceedings', id: 'advo_6' },
        { num: 7, text: 'The defendant must not reside at the same address as the protected person', id: 'advo_7' },
        { num: 8, text: 'The defendant must not enter or remain in the residence or place of employment of the protected person', id: 'advo_8' },
        { num: 9, text: 'The defendant must not approach within 100 metres of any protected person', id: 'advo_9' },
        { num: 10, text: 'The defendant must not possess a firearm or weapon', id: 'advo_10' },
        { num: 11, text: 'Other conditions as specified by the Court', id: 'advo_11' }
    ],
    
    bailConditions: [
        'Reside at specified address',
        'Report to police station daily between 6am-6pm',
        'Report to police station Monday, Wednesday, Friday between 6am-6pm',
        'Report to police station weekly between 6am-6pm',
        'Not to contact specified person',
        'Not to contact prosecution witnesses',
        'Not to go within 100 metres of specified person',
        'Not to enter specified suburb/locality',
        'Not to leave New South Wales without written permission',
        'Surrender passport to police',
        'Curfew between 8pm-6am daily',
        'Not to consume alcohol',
        'Not to consume illicit drugs',
        'Not to enter licensed premises',
        'Not to drive a motor vehicle',
        'Not to apply for or obtain a passport',
        'Forfeit surety amount if breach conditions'
    ],
    
    solicitors: [
        { code: 'AAG', name: 'Alexander Georgieff' },
        { code: 'RHH', name: 'Rylie Hahn-Hamilton' },
        { code: 'BJB', name: 'Benjamin Brown' },
        { code: 'SRS', name: 'Sophia Seton' },
        { code: 'NKM', name: 'Natalie McDonald' }
    ],
    
    contactMethods: [
        'Office attendance',
        'Phone call (incoming)',
        'Phone call (outgoing)',
        'Email',
        'Police station attendance',
        'Court appearance',
        'Conference',
        'Video conference'
    ],
    
    matterTypes: [
        'Criminal - Summary',
        'Criminal - Indictable',
        'AVO',
        'Bail Application',
        'Appeal - District Court',
        'Appeal - Supreme Court',
        'Section 14 Application',
        'Committal Hearing',
        'Trial',
        'Sentence',
        'Mention'
    ],
    
    listedForOptions: [
        'Mention',
        'Mention (Brief Reply)',
        'Brief Status',
        'Charge Certification',
        'Committal Hearing',
        'Case Conference Mention',
        'Hearing',
        'Sentence',
        'Plea of Guilty',
        'Representations',
        'Trial',
        'Section 14 Application',
        'Arraignment',
        'Return of Subpoena',
        'Compliance Mention'
    ],
    
    sentenceMaterials: [
        'Character references',
        'Medical reports',
        'Psychological reports',
        'Traffic Offender Program certificate',
        'Anger Management certificate',
        'Drug & Alcohol counselling certificate',
        'Community service records'
    ],
    
    outcomes: [
        'Not Guilty',
        'Guilty',
        'Adjourned',
        'Withdrawn',
        'Dismissed under s10',
        'Conditional Release Order',
        'Fine',
        'Community Service Order',
        'Intensive Correction Order',
        'Full-time imprisonment'
    ],
    
    penalties: [
        'Section 10(1)(a) - Dismissal',
        'Section 10(1)(b) - Conditional Release Order without conviction',
        'Fine only',
        'Conditional Release Order with conviction',
        'Community Service Order',
        'Intensive Correction Order',
        'Full-time imprisonment'
    ],
    
    templates: {
        CCL: ['CCL_Standard.docx', 'CCL_Urgent.docx', 'CCL_Complex.docx'],
        Mention: ['Mention_Standard.docx', 'Mention_Brief.docx', 'Mention_Detailed.docx'],
        Final: ['Final_Standard.docx', 'Final_Detailed.docx', 'Final_WithAppeal.docx'],
        FeeReestimate: ['FeeReestimate_Standard.docx', 'FeeReestimate_Complex.docx']
    },
    
    prefixes: ['Mr', 'Mrs', 'Ms', 'Miss', 'Dr', 'Prof'],
    
    fileNoteTypes: [
        { value: 'Phone Call', label: 'Phone Call', id: 'phoneCall' },
        { value: 'Meeting', label: 'Meeting', id: 'meeting' },
        { value: 'Court Appearance', label: 'Court Appearance', id: 'courtAppearance' },
        { value: 'Correspondence', label: 'Correspondence', id: 'correspondence' }
    ],
    
    correspondenceTypes: ['Email', 'Letter', 'Fax', 'Text Message'],
    correspondenceDirections: ['Sent', 'Received', 'Exchange'],
    
    phoneDirections: ['Incoming', 'Outgoing'],
    
    courtLevels: ['Local Court', 'District Court', 'Supreme Court'],
    
    organizationTemplates: {
        'NSW Police': {
            name: 'Commissioner of NSW Police',
            address: 'NSW Police Force\n1 Charles Street\nParramatta NSW 2150'
        }
    }
};

// Freeze to prevent accidental modification
Object.freeze(STATIC_DATA);

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.STATIC_DATA = STATIC_DATA;
}
