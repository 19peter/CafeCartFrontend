export type VendorType = {
    id: string;
    name: string;
    imageUrl: string;
};

export type VendorResponse = {
    content: VendorType[];
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
};