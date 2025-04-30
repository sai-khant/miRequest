import dayjs from "dayjs";
import { DATE_OF_ABSENCE_FROM, FIELDS_SELECTORS } from "./config";
import { mapCoordinates, mapFields } from "./utils/utils";
import { fetchPdfTemplate, updatePdf } from "./utils/pdf";

// src/content.js
console.log("✅ Content script loaded2! " + dayjs().format("hh:mm:ss"));

// from form data
let dateOfAbsenceFrom = "";
let category = null;
let numberOfDays = "";
let reasonForAbsence = "";

// from storage
let employeeName = "";
let departmentName = "";
let managerName = "";

// need calculate
let numberOfHours = "";
let dateOfAbsenceTo = ""; // need to add one day

chrome.storage.local.get(
  ["employeeName", "departmentName", "managerName"],
  function (result) {
    if (result.employeeName) {
      employeeName = result.employeeName;
    }

    if (result.departmentName) {
      departmentName = result.departmentName;
    }

    if (result.managerName) {
      managerName = result.managerName;
    }
  }
);

const fromInput = document.querySelector(
  FIELDS_SELECTORS[DATE_OF_ABSENCE_FROM]
);
const toInput = document.querySelector(FIELDS_SELECTORS[DATE_OF_ABSENCE_FROM]);

if (fromInput) {
  fromInput.addEventListener("input", (e) => {
    fromDate = dayjs(e.target.value);
  });
}

if (toInput) {
  toInput.addEventListener("input", (e) => {
    toDate = dayjs(e.target.value);
  });
}

const observer = new MutationObserver(() => {
  const foundButton = document.querySelector('button[type="submit"]');

  if (foundButton && !foundButton._listenerAttached) {
    console.log("🎯 Submit button found and attaching listener");

    foundButton.addEventListener("click", () => {
      console.log("✅ Click submit button");
      createPDF();
    });

    foundButton._listenerAttached = true;
    submitButton = foundButton;
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "triggerSubmit") {
    updatePdf(
      mapCoordinates(
        mapFields({
          dateOfAbsenceFrom,
          numberOfDays,
          reasonForAbsence,
          employeeName,
          departmentName,
          managerName,
          numberOfHours,
          dateOfAbsenceTo,
        })
      )
    );
  }
});

const createPDF = () => {
  updatePdf(
    mapCoordinates(
      mapFields({
        dateOfAbsenceFrom,
        numberOfDays,
        reasonForAbsence,
        employeeName,
        departmentName,
        managerName,
        numberOfHours,
        dateOfAbsenceTo,
      })
    )
  );
};

fetchPdfTemplate();
