const defaultProfile = {
    name: "",
    email: "",
    preferredTransport: "Car",
    travelBuffer: 10,
    productivityGoal: "",
};

export function getProfile() {
    const savedProfile = localStorage.getItem("flowstate_user_profile");

    if (!savedProfile) {
        return defaultProfile;
    }

    try {
        return {
            ...defaultProfile,
            ...JSON.parse(savedProfile),
        };
    } catch {
        return defaultProfile;
    }
}