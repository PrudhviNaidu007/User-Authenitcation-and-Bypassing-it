// script.js
document.addEventListener("DOMContentLoaded", function () {
  // Password strength checker
  const regPassword = document.getElementById('regPassword');
  const strengthBar = document.querySelector('.strength-bar');
  const strengthText = document.querySelector('.strength-text span');
  
  if (regPassword) {
    regPassword.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      // Check length
      if (password.length >= 10) strength += 2;
      else if (password.length >= 6) strength += 1;
      
      // Check complexity
      if (/[A-Z]/.test(password)) strength += 1;
      if (/[a-z]/.test(password)) strength += 1;
      if (/\d/.test(password)) strength += 1;
      if (/[@$!%*?&#]/.test(password)) strength += 2;
      
      // Update strength display
      const width = Math.min((strength / 7) * 100, 100);
      strengthBar.style.width = `${width}%`;
      
      if (strength <= 2) {
        strengthBar.style.backgroundColor = 'var(--error)';
        strengthText.textContent = 'CRITICAL';
        strengthText.style.color = 'var(--error)';
      } else if (strength <= 4) {
        strengthBar.style.backgroundColor = 'var(--warning)';
        strengthText.textContent = 'WEAK';
        strengthText.style.color = 'var(--warning)';
      } else {
        strengthBar.style.backgroundColor = 'var(--success)';
        strengthText.textContent = 'STRONG';
        strengthText.style.color = 'var(--success)';
      }
    });
  }

  // Registration logic
  document.getElementById("registerForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("regUsername").value;
    const password = document.getElementById("regPassword").value;

    if (password.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    localStorage.setItem("user", JSON.stringify({ username, password }));
    alert("Security profile created successfully!");
    window.location.href = "index.html";
  });

  // Login logic
  document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const loginUsername = document.getElementById("loginUsername").value;
    const loginPassword = document.getElementById("loginPassword").value;

    const stored = JSON.parse(localStorage.getItem("user"));

    if (stored && stored.username === loginUsername && stored.password === loginPassword) {
      localStorage.setItem("loggedInUser", loginUsername);
      window.location.href = "dashboard.html";
    } else {
      alert("Access denied! Invalid credentials.");
    }
  });
});