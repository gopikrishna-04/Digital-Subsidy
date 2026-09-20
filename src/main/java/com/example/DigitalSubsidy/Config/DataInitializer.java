package com.example.DigitalSubsidy.Config;

import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.repository.GrantSlabRepo;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private SchemeRepo schemeRepo;

    @Autowired
    private GrantSlabRepo grantSlabRepo;

    @Override
    public void run(String... args) throws Exception {
        if (schemeRepo.count() > 0) {
            return;
        }

        // 1. PM-KISAN Farmer Support
        createSchemeWithSlab(
                "PM-KISAN Samman Nidhi Scheme",
                "Central government welfare initiative providing guaranteed income support to landholding farmer families across the country.",
                "Direct cash grant of ₹6,000 per year transferred in three four-monthly installments directly into bank accounts.",
                18, 70,
                "Farmer",
                "All India",
                "Aadhaar Card, Land Ownership Records, Bank Passbook",
                "ALL", "ALL",
                6000.0, 0.0, 600000.0
        );

        // 2. Solar Rooftop Subsidy
        createSchemeWithSlab(
                "National Solar Rooftop Subsidy Scheme",
                "Promotes renewable energy adoption by providing direct capital subsidies on grid-connected residential rooftop solar panels.",
                "Direct financial assistance up to ₹78,000 for residential consumers installing 1kW to 3kW solar rooftop systems.",
                21, 75,
                "ALL",
                "All India",
                "Electricity Bill, Property Tax Receipt, Aadhaar Card, Bank Account Details",
                "ALL", "ALL",
                78000.0, 0.0, 2500000.0
        );

        // 3. PMAY Urban Housing Subsidy
        createSchemeWithSlab(
                "Pradhan Mantri Awas Yojana (PMAY-Urban)",
                "Affordable housing mission ensuring pucca houses with basic amenities for urban low-income families and economically weaker sections.",
                "Up to ₹2,50,000 interest subsidy and central assistance for house construction or enhancement.",
                21, 65,
                "ALL",
                "All India",
                "Income Certificate, Land Ownership Document, Aadhaar Card, Pan Card, Bank Statements",
                "ALL", "ALL",
                250000.0, 0.0, 600000.0
        );

        // 4. PM MUDRA Small Enterprise Grant
        createSchemeWithSlab(
                "PM MUDRA Micro-Enterprise Growth Scheme",
                "Collateral-free seed funding and capital subsidy to help small merchants, artisans, and shopkeepers expand their businesses.",
                "Working capital grant up to ₹50,000 with government-subsidized interest rates and 12-month moratorium.",
                18, 60,
                "Business",
                "All India",
                "Business Registration / Udyam Certificate, Bank Statement (6 Months), Identity Proof",
                "ALL", "ALL",
                50000.0, 0.0, 1000000.0
        );

        // 5. Handloom Weaver Modernization
        createSchemeWithSlab(
                "National Handloom Weaver Modernization Subsidy",
                "Supports traditional weavers in procuring modern ergonomic looms, electronic jacquards, and advanced textile processing kits.",
                "90% government subsidy on procurement of upgraded looms and toolkits valued up to ₹45,000.",
                18, 65,
                "Artisan",
                "All India",
                "Weaver ID Card (Pehchan), Aadhaar Card, Bank Account Details",
                "ALL", "ALL",
                45000.0, 0.0, 400000.0
        );

        // 6. Post-Matric Higher Education Grant
        createSchemeWithSlab(
                "Post-Matric Higher Education Technical Grant",
                "Scholarship and academic stipend program for meritorious students pursuing technical, engineering, and medical degrees.",
                "Full tuition reimbursement plus a monthly maintenance stipend of ₹1,500 deposited directly via DBT.",
                17, 30,
                "Student",
                "All India",
                "Admission Letter, 12th Marksheet, Income Certificate, College ID, Bank Passbook",
                "ALL", "ALL",
                65000.0, 0.0, 500000.0
        );

        // 7. Stand-Up India Women Enterprise Seed Grant
        createSchemeWithSlab(
                "Stand-Up India Women Enterprise Seed Grant",
                "Promotes female entrepreneurship by funding greenfield projects in manufacturing, trade, agriculture-allied, and service sectors.",
                "Direct capital subsidy of ₹1,00,000 to cover pre-operative expenses and initial machinery procurement.",
                18, 60,
                "Self-Employed",
                "All India",
                "Project DPR Report, Business License, Aadhaar Card, Bank Statements",
                "Female", "ALL",
                100000.0, 0.0, 1500000.0
        );

        // 8. Digital Rural Health Clinic Incentive
        createSchemeWithSlab(
                "Digital Rural Health Infrastructure Incentive",
                "Incentivizes registered healthcare workers and clinic owners to establish telemedicine and digital diagnostic kiosks in villages.",
                "Up to ₹1,20,000 grant towards medical diagnostic hardware, computers, and internet connectivity setup.",
                22, 65,
                "Healthcare",
                "All India",
                "Medical Council Registration / Degree, Clinic Premises Proof, Aadhaar Card",
                "ALL", "ALL",
                120000.0, 0.0, 1500000.0
        );

        // 9. FAME-II Clean Mobility EV Subsidy
        createSchemeWithSlab(
                "FAME-II Clean Mobility & Electric Vehicle Subsidy",
                "Incentive program driving green mobility by reducing the upfront purchase price of certified electric two-wheelers.",
                "Flat ₹15,000 direct purchase discount credited through certified EV dealerships across all districts.",
                18, 70,
                "ALL",
                "All India",
                "Valid Driving License, Aadhaar Card, Vehicle Booking Invoice",
                "ALL", "ALL",
                15000.0, 0.0, 2000000.0
        );

        // 10. PM Matsya Sampada Aquaculture Grant
        createSchemeWithSlab(
                "PM Matsya Sampada Aquaculture & Cold Chain Subsidy",
                "Promotes inland biofloc fish farming, modern insulated transport boxes, and solar cold storage facilities.",
                "60% capital subsidy up to ₹1,80,000 for setting up recirculatory aquaculture units and refrigerated transport.",
                18, 65,
                "Fisherman",
                "All India",
                "Fisherman Registration Certificate, Pond / Land Document, Bank Account Details",
                "ALL", "ALL",
                180000.0, 0.0, 700000.0
        );
    }

    private void createSchemeWithSlab(
            String name,
            String desc,
            String benefits,
            int minAge, int maxAge,
            String occupation,
            String location,
            String docs,
            String gender,
            String category,
            Double grantAmount,
            Double minIncome,
            Double maxIncome) {

        Scheme scheme = new Scheme();
        scheme.setSchemeName(name);
        scheme.setDescription(desc);
        scheme.setBenefits(benefits);
        scheme.setMinimumAge(minAge);
        scheme.setMaximumAge(maxAge);
        scheme.setEligibleOccupation(occupation);
        scheme.setEligibleLocation(location);
        scheme.setRequiredDocuments(docs);
        scheme.setEligibleGender(gender);
        scheme.setEligibleBeneficiaryCategory(category);
        scheme.setStatus("ACTIVE");
        scheme.setStartDate(LocalDate.now().minusMonths(1));
        scheme.setEndDate(LocalDate.now().plusYears(2));

        Scheme saved = schemeRepo.save(scheme);

        GrantSlab slab = new GrantSlab();
        slab.setScheme(saved);
        slab.setGrantAmount(grantAmount);
        slab.setMinimumIncome(minIncome);
        slab.setMaximumIncome(maxIncome);
        grantSlabRepo.save(slab);
    }
}
