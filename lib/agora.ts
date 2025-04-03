// Agora RTC client configuration
export const agoraConfig = {
  appId: process.env.NEXT_PUBLIC_AGORA_APP_ID || "",
};

// Check if Agora is properly configured
export const isAgoraConfigured = () => {
  return !!agoraConfig.appId;
};
