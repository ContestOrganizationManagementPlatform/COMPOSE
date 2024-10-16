import { supabase } from '$lib/supabaseClient'; // Your Supabase client initialization


let cachedSettings = null;
export async function fetchSettings() {
    if (cachedSettings) {
        return cachedSettings;  // Return cached settings if already fetched
    }
    const { data, error } = await supabase
        .from('settings')
        .select('settings')  // Assuming the 'settings' column contains your JSON file
        .single();  // Fetch a single row

    if (error) {
        console.error('Error fetching settings:', error);
        return null;
    }

    cachedSettings = data?.settings || {};  // Cache the settings
    return cachedSettings;
}
