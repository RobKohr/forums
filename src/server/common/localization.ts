interface TranslationStrings {
    [key: string]: {
        [key: string]: string;
    }
}


const translationStrings: TranslationStrings = {
    strongerPassword: {
        'en': 'Add more letters, numbers, and symbols to make a stronger password.',
    }
}

export function localization(key: string): string {
    const language = 'en';
    return translationStrings[key][language] || key;
}