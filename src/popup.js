const generateButton = document.getElementById("generate-pdf");
const previewFrame = document.getElementById("pdf-preview");

const employeeNameInput = document.getElementById("employeeName");
const departmentNameInput = document.getElementById("departmentName");
const managerNameInput = document.getElementById("managerName");

chrome.storage.local.get(
  ["employeeName", "departmentName", "managerName"],
  function (result) {
    if (result.employeeName) {
      employeeNameInput.value = result.employeeName;
    }

    if (result.departmentName) {
      departmentNameInput.value = result.departmentName;
    }

    if (result.managerName) {
      managerNameInput.value = result.managerName;
    }
  }
);

employeeNameInput.addEventListener("input", (event) => {
  chrome.storage.local.set({ employeeName: event.target.value }, function () {
    console.log("employeeName saved:", event.target.value);
  });
});

departmentNameInput.addEventListener("input", (event) => {
  chrome.storage.local.set({ departmentName: event.target.value }, function () {
    console.log("departmentName saved:", event.target.value);
  });
});

managerNameInput.addEventListener("input", (event) => {
  chrome.storage.local.set({ managerName: event.target.value }, function () {
    console.log("managerName saved:", event.target.value);
  });
});

document.getElementById("submitBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "triggerSubmit" });
  });
});
