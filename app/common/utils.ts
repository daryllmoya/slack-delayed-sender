export const isValidUrl = (
  url: string,
  allowLocal: boolean = false
): boolean => {
  try {
    const parsed = new URL(url);

    // Allow only http or https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    // Block empty hostname or non-dot domains unless explicitly allowed
    const isLocalhost =
      parsed.hostname === 'localhost' || /^[0-9.]+$/.test(parsed.hostname);
    if (!allowLocal && (isLocalhost || !parsed.hostname.includes('.')))
      return false;

    return true;
  } catch {
    return false;
  }
};
