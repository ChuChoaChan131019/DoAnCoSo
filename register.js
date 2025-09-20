document.addEventListener('DOMContentLoaded', () => {
  const candidateBtn = document.getElementById("candidateBtn");
  const employerBtn = document.getElementById("employerBtn");
  const candidateForm = document.getElementById("candidateForm");
  const employerForm = document.getElementById("employerForm");

  candidateBtn.onclick = () => {
    candidateForm.classList.remove("hidden");
    employerForm.classList.add("hidden");
    candidateBtn.classList.add("active");
    employerBtn.classList.remove("active");
  };

  employerBtn.onclick = () => {
    employerForm.classList.remove("hidden");
    candidateForm.classList.add("hidden");
    employerBtn.classList.add("active");
    candidateBtn.classList.remove("active");
  };
});