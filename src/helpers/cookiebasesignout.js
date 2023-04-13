app.get("/api/v1/users/signout", (req, res) => {
  // Clear any authentication tokens or cookies
  res.clearCookie("auth_token");
  // Send a response to the client indicating success
  res.status(200).json({ message: "User signed out successfully" });
});
