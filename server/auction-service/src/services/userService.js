export const getUserEmailById = async (userId) => {
  try {
    console.log("\n========== getUserEmailById ==========");
    console.log("User ID:", userId);
    console.log("AUTH_SERVICE_URL:", process.env.AUTH_SERVICE_URL);

    const url = `${process.env.AUTH_SERVICE_URL}/internal/users/${userId}`;
    console.log("Request URL:", url);

    console.log("Request Headers:", {
      "x-internal-api-key": process.env.INTERNAL_API_KEY,
    });

    const response = await fetch(url, {
      headers: {
        "x-internal-api-key": process.env.INTERNAL_API_KEY,
      },
    });

    console.log("Response Status:", response.status);
    console.log("Response OK:", response.ok);

    const responseBody = await response.text();
    console.log("Raw Response Body:", responseBody);

    if (!response.ok) {
      console.error(`Failed to fetch user ${userId}: ${response.status}`);
      return null;
    }

    const data = JSON.parse(responseBody);

    console.log("Parsed Response:", data);
    console.log("User Email:", data.user?.email);
    console.log("=====================================\n");

    return data.user.email;
  } catch (error) {
    console.error("Error fetching user email:", error);
    console.error(error.stack);
    return null;
  }
};
