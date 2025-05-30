export function generateRandomEntryId() {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    // fallback 이전, crypto.getRandomValues 지원 여부 확인
    if (typeof window.crypto?.getRandomValues !== 'function') {
        return 'uuid-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
    }

    // fallback (UUID v4 포맷)
    const hex = (n) => crypto.getRandomValues(new Uint8Array(n)).reduce((acc, b) => acc + b.toString(16).padStart(2, '0'), '');
    return `${hex(4)}-${hex(2)}-4${hex(1).slice(0,3)}-${(8 + Math.floor(Math.random() * 4)).toString(16)}${hex(1).slice(0,3)}-${hex(6)}`;
}