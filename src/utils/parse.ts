export const parsePrice = (value: string): number => {
    if (!value) return 0;
    const cleaned = value.includes(":") ? value.split(":")[1] : value;
    return Number(String(cleaned).replace(/[^\d]/g, ""));
};

// utils/format.js
