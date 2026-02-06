export interface Client {
    _id?: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    projectType: 'Web' | 'App' | 'SaaS' | 'SEO' | 'Other';
    website?: string;
    status: 'Active' | 'Inactive';
    notes?: string;
    createdAt?: string;
}

export interface Asset {
    _id?: string;
    client: string | Client;
    category: 'Domain' | 'Hosting' | 'Server' | 'Email' | 'Database' | 'Cloudinary' | 'Other';
    serviceName: string;
    identifier: string;
    credentials?: {
        username?: string;
        password?: string;
        apiKey?: string;
        apiSecret?: string;
    };
    expiryDate?: string;
    autoRenew?: boolean;
    renewalCost?: number;
    currency?: string;
    notes?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
}
