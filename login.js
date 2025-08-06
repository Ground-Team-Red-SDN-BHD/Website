function handleCredentialResponse(response) {
  const data = parseJwt(response.credential);
  const email = data.email;

  console.log("Logged in as: " + email);

  if (email.endsWith('@groundteamred.com')) {
    // ✅ Email dibenarkan
    window.location.href = "https://ground-team-red-sdn-bhd.github.io/AirAsia/";
  } else {
    // ❌ Email bukan dari domain GTR
    window.location.href = "unauthorized.html";
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "345144651630-7e0uhvp4pamjp6d62dd2eu1j8k84j15u.apps.googleusercontent.com", // 👈 Ganti
    callback: handleCredentialResponse
  });

  google.accounts.id.renderButton(
    document.getElementById("signInDiv"),
    { theme: "outline", size: "large" }
  );

  google.accounts.id.prompt(); // Auto popup sign in
};
