document.addEventListener("DOMContentLoaded", () => {
  const copyCheckbox = document.getElementById("toggle-copy-fetch");
  const blurCheckbox = document.getElementById("toggle-blur-selection");

  // Ambil nilai awal dari storage
  chrome.storage.local.get(["autoFetchOnCopy", "blurSelectionEnabled"], (result) => {
    copyCheckbox.checked = result.autoFetchOnCopy ?? true;
    blurCheckbox.checked = result.blurSelectionEnabled ?? true;
  });

  // Simpan saat checkbox berubah
  copyCheckbox.addEventListener("change", () => {
    chrome.storage.local.set({ autoFetchOnCopy: copyCheckbox.checked });
  });

  blurCheckbox.addEventListener("change", () => {
    chrome.storage.local.set({ blurSelectionEnabled: blurCheckbox.checked });
  });
});
