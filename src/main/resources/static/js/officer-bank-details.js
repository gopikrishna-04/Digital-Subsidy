// ================= GET STAFF DATA =================

const staffEmail =
    localStorage.getItem("staffEmail");

const staffRole =
    localStorage.getItem("staffRole");


// ================= ACCESS CHECK =================

if (
    !staffEmail ||
    (staffRole !== "ADMIN" &&
        staffRole !== "FINANCE_OFFICER")
) {

    window.location.href =
        "staff-login.html";

    // Stop execution
    throw new Error("Unauthorized access");
}


// ================= TABLE =================

const bankDetailsBody =
    document.getElementById(
        "bankDetailsBody"
    );


let allBankDetails = [];
let activeReviewBank = null;

function checkNameMatch(applicantName, holderName) {
    if (!applicantName || !holderName) return { match: false, text: "Cannot Determine" };
    const a = applicantName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    const h = holderName.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (a === h || a.includes(h) || h.includes(a)) {
        return { match: true, text: "✓ Name Match Confirmed" };
    }
    return { match: false, text: "⚠ Name Mismatch Warning" };
}

// ================= LOAD BANK DETAILS =================
async function loadBankDetails() {
    try {
        const response = await fetch("http://localhost:8080/bank-details", {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Unable to load bank details");
        }

        allBankDetails = await response.json();
        bankDetailsBody.innerHTML = "";

        if (allBankDetails.length === 0) {
            bankDetailsBody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; color: #64748b; padding: 25px;">
                        No bank details submitted yet.
                    </td>
                </tr>
            `;
            return;
        }

        allBankDetails.forEach(function (bank) {
            const row = document.createElement("tr");

            const app = bank.application || {};
            const user = app.user || {};
            const applicantName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Applicant";
            const schemeName = app.scheme ? app.scheme.schemeName : "N/A";
            const holderName = bank.accountHolderName || "-";
            const bankAndBranch = `${bank.bankName || "-"}${bank.branchName ? ` (${bank.branchName})` : ""}`;
            const matchInfo = checkNameMatch(applicantName, holderName);
            const matchBadge = matchInfo.match
                ? `<span class="match-badge match-success">${matchInfo.text}</span>`
                : `<span class="match-badge match-warn">${matchInfo.text}</span>`;

            let actionHTML = "";
            if (bank.verificationStatus === "PENDING") {
                actionHTML = `
                    <button class="review-btn" data-id="${bank.id}">
                        🔍 Review & Verify
                    </button>
                    <button class="reject-btn" data-id="${bank.id}">
                        Reject
                    </button>
                `;
            } else if (bank.verificationStatus === "VERIFIED") {
                actionHTML = `<span style="color: #166534; font-weight: 600;">✓ Verified</span>`;
            } else {
                actionHTML = `<span style="color: #991b1b; font-weight: 600;">✗ Rejected</span>`;
            }

            row.innerHTML = `
                <td><strong>#${app.id || "-"}</strong></td>
                <td>${schemeName}</td>
                <td>${applicantName}</td>
                <td><strong>${holderName}</strong></td>
                <td>${bankAndBranch}</td>
                <td style="font-family: monospace; letter-spacing: 0.5px;">${bank.accountNumber || "-"}</td>
                <td style="font-family: monospace; font-weight: 600;">${bank.ifscCode || "-"}</td>
                <td>${matchBadge}</td>
                <td class="status-${(bank.verificationStatus || "").toLowerCase()}">
                    ${bank.verificationStatus || "PENDING"}
                </td>
                <td style="white-space: nowrap;">
                    ${actionHTML}
                </td>
            `;

            bankDetailsBody.appendChild(row);
        });

        // Attach review buttons
        document.querySelectorAll(".review-btn").forEach(button => {
            button.addEventListener("click", function () {
                openReviewModal(Number(this.dataset.id));
            });
        });

        // Attach reject buttons
        document.querySelectorAll(".reject-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const reason = prompt("Enter rejection reason for bank details:");
                if (reason && reason.trim()) {
                    await rejectBank(this.dataset.id, reason.trim());
                }
            });
        });

    } catch (error) {
        console.error(error);
        bankDetailsBody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; color: #dc2626; padding: 25px;">
                    Unable to load bank details.
                </td>
            </tr>
        `;
    }
}

// ================= MODAL LOGIC =================
const modalOverlay = document.getElementById("bankModalOverlay");
const modalAppId = document.getElementById("modalAppId");
const modalSchemeName = document.getElementById("modalSchemeName");
const modalApplicantName = document.getElementById("modalApplicantName");
const modalHolderName = document.getElementById("modalHolderName");
const modalNameMatch = document.getElementById("modalNameMatch");
const modalBankName = document.getElementById("modalBankName");
const modalBranchName = document.getElementById("modalBranchName");
const modalAccountNum = document.getElementById("modalAccountNum");
const modalIfsc = document.getElementById("modalIfsc");
const modalVerifyBtn = document.getElementById("modalVerifyBtn");
const modalRejectBtn = document.getElementById("modalRejectBtn");
const modalCloseBtn = document.getElementById("modalCloseBtn");

function openReviewModal(bankId) {
    activeReviewBank = allBankDetails.find(b => Number(b.id) === bankId);
    if (!activeReviewBank) return;

    const app = activeReviewBank.application || {};
    const user = app.user || {};
    const applicantName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Applicant";
    const schemeName = app.scheme ? app.scheme.schemeName : "N/A";
    const holderName = activeReviewBank.accountHolderName || "-";
    const matchInfo = checkNameMatch(applicantName, holderName);

    modalAppId.textContent = `#${app.id || "-"}`;
    modalSchemeName.textContent = schemeName;
    modalApplicantName.textContent = applicantName;
    modalHolderName.textContent = holderName;
    modalNameMatch.innerHTML = matchInfo.match
        ? `<span class="match-badge match-success" style="font-size: 13px;">${matchInfo.text}</span>`
        : `<span class="match-badge match-warn" style="font-size: 13px;">${matchInfo.text}</span>`;
    modalBankName.textContent = activeReviewBank.bankName || "-";
    modalBranchName.textContent = activeReviewBank.branchName || "-";
    modalAccountNum.textContent = activeReviewBank.accountNumber || "-";
    modalIfsc.textContent = activeReviewBank.ifscCode || "-";

    modalVerifyBtn.disabled = false;
    modalVerifyBtn.textContent = "Approve & Verify Bank Details";

    modalOverlay.style.display = "flex";
}

function closeReviewModal() {
    modalOverlay.style.display = "none";
    activeReviewBank = null;
}

if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeReviewModal);
if (modalOverlay) {
    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) closeReviewModal();
    });
}

if (modalVerifyBtn) {
    modalVerifyBtn.addEventListener("click", async function () {
        if (!activeReviewBank) return;
        modalVerifyBtn.disabled = true;
        modalVerifyBtn.textContent = "Verifying Bank Details...";
        await verifyBank(activeReviewBank.id);
        closeReviewModal();
    });
}

if (modalRejectBtn) {
    modalRejectBtn.addEventListener("click", async function () {
        if (!activeReviewBank) return;
        const reason = prompt("Enter rejection reason for bank details:");
        if (reason && reason.trim()) {
            modalRejectBtn.disabled = true;
            await rejectBank(activeReviewBank.id, reason.trim());
            closeReviewModal();
        }
    });
}


// ================= VERIFY BANK =================

async function verifyBank(id) {

    try {

        const response =
            await fetch(
                "http://localhost:8080/bank-details/"
                + id
                + "/verify",
                {
                    method: "PUT",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to verify bank details"
            );

            return;
        }


        alert(
            "Bank details verified successfully"
        );


        loadBankDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }

}


// ================= REJECT BANK =================

async function rejectBank(id, reason) {

    try {

        const response =
            await fetch(
                "http://localhost:8080/bank-details/"
                + id
                + "/reject?reason="
                + encodeURIComponent(reason),
                {
                    method: "PUT",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            alert(
                error ||
                "Unable to reject bank details"
            );

            return;
        }


        alert(
            "Bank details rejected successfully"
        );


        loadBankDetails();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to connect to server"
        );

    }

}


// ================= PROFILE =================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ================= EMAIL =================

        const staffEmailElement =
            document.getElementById(
                "staffEmail"
            );

        const dropdownStaffEmail =
            document.getElementById(
                "dropdownStaffEmail"
            );


        if (staffEmailElement) {

            staffEmailElement.textContent =
                staffEmail;

        }


        if (dropdownStaffEmail) {

            dropdownStaffEmail.textContent =
                staffEmail;

        }


        // ================= ROLE =================

        const staffRoleText =
            document.getElementById(
                "staffRoleText"
            );


        if (staffRoleText) {

            staffRoleText.textContent =
                staffRole === "ADMIN"
                    ? "Administrator"
                    : "Finance Officer";

        }


        // ================= PROFILE DROPDOWN =================

        const profileButton =
            document.getElementById(
                "profileButton"
            );

        const profileDropdown =
            document.getElementById(
                "profileDropdown"
            );


        if (
            profileButton &&
            profileDropdown
        ) {

            profileButton.addEventListener(
                "click",
                function () {

                    profileDropdown.classList.toggle(
                        "show"
                    );

                }
            );

        }


        // ================= LOGOUT =================

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "staffEmail"
                    );

                    localStorage.removeItem(
                        "staffRole"
                    );

                    window.location.href =
                        "staff-login.html";

                }
            );

        }

    }
);


// ================= LOAD WHEN PAGE OPENS =================

loadBankDetails();