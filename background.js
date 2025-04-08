chrome.runtime.onInstalled.addListener(() => {
  // Buat context menu saat ekstensi pertama kali diinstall
  chrome.contextMenus.create({
    id: "geminiContextMenu",
    title: "Tanya Gemini",
    contexts: ["selection"]
  });
  
  // Set background color
  chrome.storage.local.set({
    autoFetchOnCopy: true,
    blurSelectionEnabled: true
  }, () => {
    console.log("Pengaturan default diset.");
  });
});

// Handler ketika user klik context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "geminiContextMenu") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: showDialog,
      args: [info.selectionText]
    });
  }
});

// Fungsi untuk dispatch event ke content.js
function showDialog(selectedText) {
  window.dispatchEvent(new CustomEvent("gemini-request", { detail: selectedText }));
}