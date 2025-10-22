
const CONFIG = {
    zapier: {
        webhookUrl: 'https://hooks.zapier.com/hooks/catch/19713185/u47xnci/'
    },
    
    supabase: {
        url: 'https://mtqigmqynrpsoaiplsho.supabase.co',
        firmId: '1938adc8-c5d5-4e3a-8b5a-9e7f6d5c4b3a',
        userId: 'ce79738f-d4e6-4f5b-9c8a-7d6e5f4c3b2a'
    },
    
    firm: {
        name: 'Your Law Firm',
        address: '49 Dumaresq Street',
        city: 'Campbelltown NSW 2560',
        fullAddress: '49 Dumaresq Street, Campbelltown NSW 2560',
        phone: '02 4626 5077'
    },
    
    solicitors: {
        'AAG': 'Alexander Georgieff',
        'RHH': 'Rylie Hahn-Hamilton',
        'BJB': 'Benjamin Brown',
        'SRS': 'Sophia Seton',
        'NKM': 'Natalie McDonald'
    },
    
    courts: {
        'Local Court': [
            'Campbelltown',
            'Sydney Downing Centre',
            'Parramatta',
            'Liverpool',
            'Penrith',
            'Camden',
            'Picton',
            'Moss Vale'
        ],
        'District Court': [
            'Sydney Downing Centre',
            'Parramatta',
            'Campbelltown',
            'Penrith'
        ],
        'Supreme Court': [
            'Sydney',
            'Parramatta'
        ]
    },
    
    templates: {
        'CCL': 'CCL_Template.docx',
        'Mention': 'Mention_Template.docx',
        'Final': 'Final_Template.docx',
        'FeeReestimate': 'FeeReestimate_Template.docx'
    },
    
    storage: {
        clientsKey: 'legalClients',
        selectedClientKey: 'selectedClient'
    }
};
