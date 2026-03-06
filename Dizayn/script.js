function openInfo(text) {
  document.getElementById("modal-text").innerText = text;
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}