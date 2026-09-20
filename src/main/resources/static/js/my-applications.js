const container =
    document.getElementById("applicationsContainer");

const userEmail =
    localStorage.getItem("userEmail");

if (!userEmail) {
    window.location.href = "login.html";
}

const navUserEmail =
    document.getElementById("navUserEmail");

const dropdownEmail =
    document.getElementById("dropdownEmail");

if (navUserEmail) {
    navUserEmail.textContent = userEmail;
}

if (dropdownEmail) {
    dropdownEmail.textContent = userEmail;
}


async function loadApplications() {

    if (!userEmail) {

        window.location.href = "login.html";

        return;
    }


    try {

        // ================= GET USER PROFILES =================

        const userResponse = await fetch(
            "/users",
            {
                credentials: "include"
            }
        );


        if (!userResponse.ok) {

            throw new Error(
                "Unable to load users"
            );

        }


        const users =
            await userResponse.json();


        // ================= FIND LOGGED-IN USER =================

        const currentUser =
            users.find(
                user =>
                    user.emailId &&
                    user.emailId
                        .trim()
                        .toLowerCase() ===
                    userEmail
                        .trim()
                        .toLowerCase()
            );


        if (!currentUser) {

            container.innerHTML = `
                <div class="empty-state">

                    <h3>
                        Profile not found
                    </h3>

                    <p>
                        Please complete your profile first.
                    </p>

                    <a href="profile.html"
                       class="btn primary-btn">
                        Complete Profile
                    </a>

                </div>
            `;

            return;
        }


        // ================= GET ALL APPLICATIONS =================

        const response = await fetch(
            "/applications",
            {
                credentials: "include"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load applications"
            );

        }


        const applications =
            await response.json();


        // ================= ONLY LOGGED-IN USER'S APPLICATIONS =================

        const myApplications =
            applications
                .filter(application => {

                    if (!application.user) {
                        return false;
                    }


                    const sameUser =
                        Number(application.user.id) ===
                        Number(currentUser.id)

                        ||

                        (
                            application.user.emailId &&
                            currentUser.emailId &&

                            application.user.emailId
                                .trim()
                                .toLowerCase() ===
                            currentUser.emailId
                                .trim()
                                .toLowerCase()
                        );


                    return sameUser &&
                        application.status !== "WITHDRAWN";

                })


                // ================= SORT =================

                .sort((a, b) => {

                    const dateDifference =
                        new Date(b.applicationDate) -
                        new Date(a.applicationDate);


                    if (dateDifference !== 0) {
                        return dateDifference;
                    }


                    return b.id - a.id;

                });


        console.log(
            "CURRENT USER:",
            currentUser
        );

        console.log(
            "MY APPLICATIONS:",
            myApplications
        );


        container.innerHTML = "";


        // ================= NO APPLICATIONS =================

        if (myApplications.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div>📋</div>

                    <h3>
                        No applications yet
                    </h3>

                    <p>
                        You haven't applied for any
                        subsidy schemes yet.
                    </p>

                    <a href="eligible-schemes.html"
                       class="btn primary-btn">
                        View Eligible Schemes
                    </a>

                </div>
            `;

            return;
        }


function generateStepperHTML(application, bankDetails, installmentPlans, milestones) {
    const status = (application.status || "").toUpperCase();

    const isSubmitted = true;
    const isFieldVerified = ["FIELD_VERIFIED", "DISTRICT_APPROVED", "APPROVED", "DISBURSED"].includes(status);
    const isDistrictVerified = ["DISTRICT_APPROVED", "APPROVED", "DISBURSED"].includes(status);
    const isBankSubmitted = !!bankDetails;
    const isBankVerified = bankDetails && bankDetails.verificationStatus === "VERIFIED";
    const isAppApproved = ["APPROVED", "DISBURSED"].includes(status);

    const plan1 = (installmentPlans || []).find(p => p.installmentNumber === 1);
    const isInst1Paid = !!(plan1 && plan1.status === "PAID");

    const m1 = (milestones || []).find(m => m.installmentNumber === 1);
    const isM1Submitted = isInst1Paid && !!(m1 && (m1.utilizationProof || ["SUBMITTED", "COMPLETED"].includes(m1.status)));
    const isM1Verified = !!(m1 && m1.status === "COMPLETED");

    const plan2 = (installmentPlans || []).find(p => p.installmentNumber === 2);
    const isInst2Paid = !!(plan2 && plan2.status === "PAID");

    const m2 = (milestones || []).find(m => m.installmentNumber === 2);
    const isM2Submitted = isInst2Paid && !!(m2 && (m2.utilizationProof || ["SUBMITTED", "COMPLETED"].includes(m2.status)));
    const isM2Verified = !!(m2 && m2.status === "COMPLETED");

    const isDisbursed = status === "DISBURSED" || (installmentPlans && installmentPlans.length > 0 && installmentPlans.every(p => p.status === "PAID"));

    const steps = [
        { num: 1, label: "Application Submitted", done: isSubmitted },
        { num: 2, label: "Field Officer Verified", done: isFieldVerified },
        { num: 3, label: "District Officer Verified", done: isDistrictVerified },
        { num: 4, label: "Bank Details Submitted", done: isBankSubmitted },
        { num: 5, label: "Bank Details Verified", done: isBankVerified },
        { num: 6, label: "Application Approved", done: isAppApproved },
        { num: 7, label: "Installment 1 Paid", done: isInst1Paid },
        { num: 8, label: "Utilization Proof 1 Submitted", done: isM1Submitted },
        { num: 9, label: "Utilization Proof 1 Verified", done: isM1Verified },
        { num: 10, label: "Installment 2 Paid", done: isInst2Paid },
        { num: 11, label: "Utilization Proof 2 Submitted", done: isM2Submitted },
        { num: 12, label: "Utilization Proof 2 Verified", done: isM2Verified },
        { num: 13, label: "Disbursed", done: isDisbursed }
    ];

    let activeIndex = steps.findIndex(s => !s.done);
    if (activeIndex === -1) activeIndex = 13;

    let html = `
        <div class="stepper-container">
            <div class="stepper-wrapper">
    `;

    steps.forEach((step, idx) => {
        let stateClass = "pending";
        let iconContent = step.num;
        let lineClass = "";

        if (step.done) {
            stateClass = "completed";
            iconContent = "✓";
            lineClass = "completed";
        } else if (idx === activeIndex) {
            stateClass = "active";
            iconContent = step.num;
        }

        const showLine = idx < steps.length - 1;

        html += `
            <div class="step-item ${stateClass}">
                <div class="step-circle ${stateClass}">${iconContent}</div>
                <div class="step-number">${step.num}</div>
                <div class="step-label">${step.label}</div>
                ${showLine ? `<div class="step-line ${lineClass}"></div>` : ""}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

        // ================= CREATE APPLICATION CARDS =================
        for (const application of myApplications) {
            const card = document.createElement("div");
            card.className = "application-card";

            const schemeName = application.scheme ? application.scheme.schemeName : "Unknown Scheme";
            const status = application.status || "SUBMITTED";

            // Load tracking details for the 13-step progress bar
            let bankDetails = null;
            let installmentPlans = [];
            let milestones = [];

            try {
                const [bRes, iRes, mRes] = await Promise.all([
                    fetch(`/bank-details/application/${application.id}`, { credentials: "include" }),
                    fetch(`/installment-plans/application/${application.id}`, { credentials: "include" }),
                    fetch(`/compliance-milestones/application/${application.id}`, { credentials: "include" })
                ]);
                if (bRes.ok) {
                    const bTxt = await bRes.text();
                    if (bTxt && bTxt.trim()) bankDetails = JSON.parse(bTxt);
                }
                if (iRes.ok) installmentPlans = await iRes.json();
                if (mRes.ok) milestones = await mRes.json();
            } catch (err) {
                console.warn("Could not load tracking data for application", application.id, err);
            }

            let displayStatus = status;
            if (status === "APPROVED" && installmentPlans.length > 0 && installmentPlans.every(p => p.status === "PAID")) {
                displayStatus = "DISBURSED";
            }

            const stepperHTML = generateStepperHTML(application, bankDetails, installmentPlans, milestones);

            card.innerHTML = `
                <div class="application-card-header">
                    <div>
                        <p class="hero-tag">APPLICATION #${application.id}</p>
                        <h3>${schemeName}</h3>
                    </div>
                    <span class="application-status ${displayStatus.toLowerCase()}">
                        ${displayStatus}
                    </span>
                </div>

                <div class="application-details">
                    <div>
                        <small>Application Date</small>
                        <strong>${application.applicationDate || "-"}</strong>
                    </div>
                    <a href="application-details.html?applicationId=${application.id}" class="view-application-btn">
                        View Application →
                    </a>
                </div>

                ${stepperHTML}

                ${
                    status === "SUBMITTED" || status === "PENDING"
                        ? `
                        <div style="margin-top: 15px;">
                            <button class="btn login-btn withdraw-btn" data-id="${application.id}">
                                Withdraw Application
                            </button>
                        </div>
                        `
                        : ""
                }
            `;


            // ================= ADD CARD =================

            container.appendChild(card);


            // ================= WITHDRAW =================

            const withdrawButton =
                card.querySelector(".withdraw-btn");


            if (withdrawButton) {

                withdrawButton.addEventListener(
                    "click",
                    async function () {

                        const applicationId =
                            this.dataset.id;


                        const confirmed =
                            confirm(
                                "Are you sure you want to withdraw this application?"
                            );


                        if (!confirmed) {
                            return;
                        }


                        try {

                            const response =
                                await fetch(
                                    `/applications/${applicationId}/withdraw`,
                                    {
                                        method: "PUT",
                                        credentials: "include"
                                    }
                                );


                            if (!response.ok) {

                                let errorMessage =
                                    "Unable to withdraw application.";


                                try {

                                    const error =
                                        await response.json();

                                    errorMessage =
                                        error.message ||
                                        errorMessage;

                                } catch (e) {
                                    // Ignore JSON parsing error
                                }


                                alert(errorMessage);

                                return;
                            }


                            alert(
                                "Application withdrawn successfully."
                            );


                            // Remove card from screen

                            card.remove();


                        } catch (error) {

                            console.error(error);

                            alert(
                                "Unable to connect to the server."
                            );

                        }

                    }
                );

            }

        }


    } catch (error) {

        console.error(error);


        container.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load applications
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

    }

}


loadApplications();
