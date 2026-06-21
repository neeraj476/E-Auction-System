export const getUserEmailById = async (userId) => {
  try {
    const response = await fetch(
      `${process.env.AUTH_SERVICE_URL}/internal/users/${userId}`,
      {
        headers: { "x-internal-api-key": process.env.INTERNAL_API_KEY },
      },
    );

    if (!response.ok) {
      console.log(`Failed to fetch user ${userId}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.user.email;
  } catch (error) {
    console.log("Error fetching user email:", error.message);
    return null;
  }
};
