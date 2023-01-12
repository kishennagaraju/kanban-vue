const APISettings = {
    token: import.meta.env.VITE_API_TOKEN,
    baseURL: import.meta.env.VITE_API_URL,
}

export function listCardsUrl() {
    return APISettings.baseURL + import.meta.env.VITE_LIST_CARDS_METHOD + '?access_token=' + APISettings.token;
}

export function postCardsUrl() {
    return APISettings.baseURL + import.meta.env.VITE_POST_CARDS_METHOD + '?access_token=' + APISettings.token;
}

export function exportDbUrl() {
    return APISettings.baseURL + import.meta.env.VITE_EXPORT_DB_METHOD + '?access_token=' + APISettings.token;
}