export const Theme = {
    colors: {
        background: {
            app: '#F7F8FA',
            card: '#FFFFFF',
        },
        primary: {
            default: '#1F7A5A',
            secondary: '#2AA876',
        },
        accent: {
            purple: '#6D5EF6',
            purpleLight: '#E9E7FF',
        },
        danger: {
            default: '#F04438',
            background: '#FFE4E2',
        },
        warning: {
            default: '#FFB020',
        },
        success: {
            default: '#10B981',
            background: '#ECFDF5',
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#94A3B8',
        },
        border: '#E2E8F0',
    },
    radius: {
        sm: 8,
        md: 14,    // Input & Button min
        lg: 18,    // Button max
        xl: 22,    // Card max
        full: 9999, // Pills/Chips
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    shadows: {
        card: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
        },
        soft: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 1,
        }
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700', color: '#0F172A' },
        h2: { fontSize: 24, fontWeight: '600', color: '#0F172A' },
        h3: { fontSize: 20, fontWeight: '600', color: '#0F172A' },
        h4: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
        bodyLg: { fontSize: 16, fontWeight: '400', color: '#475569' },
        body: { fontSize: 14, fontWeight: '400', color: '#475569' },
        bodySm: { fontSize: 13, fontWeight: '400', color: '#475569' },
        caption: { fontSize: 12, fontWeight: '400', color: '#94A3B8' },
    }
} as const;
