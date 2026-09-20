package com.example.DigitalSubsidy.service;

import com.example.DigitalSubsidy.dto.EligibleSchemeDTO;
import com.example.DigitalSubsidy.entity.GrantSlab;
import com.example.DigitalSubsidy.entity.Scheme;
import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.repository.GrantSlabRepo;
import com.example.DigitalSubsidy.repository.SchemeRepo;
import com.example.DigitalSubsidy.repository.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class SchemeService {

    @Autowired
    SchemeRepo schemerepo;

    @Autowired
    userRepo userrepo;

    @Autowired
    GrantSlabRepo grantslabrepo;


    public Scheme createScheme(Scheme scheme) {
        return schemerepo.save(scheme);
    }


    public List<Scheme> getAllSchemes() {
        return schemerepo.findAll();
    }


    public Scheme getSchemeById(Long id) {
        return schemerepo.findById(id).orElse(null);
    }


    public void deleteScheme(Long id) {
        schemerepo.deleteById(id);
    }

    public List<EligibleSchemeDTO> getEligibleSchemes(Long userId) {

        User user =
                userrepo.findById(userId).orElse(null);

        if (user == null) {
            return List.of();
        }


        LocalDate dob =
                user.getDateofbirth();

        int age =
                Period.between(
                        dob,
                        LocalDate.now()
                ).getYears();


        List<Scheme> schemes =
                schemerepo.findAll();


        return schemes.stream()

                // STATUS
                .filter(scheme ->
                        "ACTIVE".equalsIgnoreCase(
                                scheme.getStatus()
                        )
                )


                // AGE
                .filter(scheme ->
                        age >= scheme.getMinimumAge()
                                &&
                                age <= scheme.getMaximumAge()
                )


                // INCOME SLAB
                // INCOME
                .filter(scheme -> {

                    boolean result =
                            grantslabrepo
                                    .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                            scheme.getId(),
                                            user.getAnnualIncome(),
                                            user.getAnnualIncome()
                                    )
                                    .isPresent();
                    System.out.println(
                            "AGE = " + age +
                                    " | MIN = " + scheme.getMinimumAge() +
                                    " | MAX = " + scheme.getMaximumAge()
                    );
                    System.out.println(
                            "OCCUPATION = " + user.getOccupation() +
                                    " | SCHEME = " + scheme.getEligibleOccupation()
                    );

                    System.out.println(
                            "INCOME = " + user.getAnnualIncome() +
                                    " | SCHEME ID = " + scheme.getId() +
                                    " | RESULT = " + result
                    );
                    System.out.println(
                            "CATEGORY = " + user.getBeneficiaryCategory() +
                                    " | SCHEME CATEGORY = " +
                                    scheme.getEligibleBeneficiaryCategory()
                    );

                    return result;
                })

                // OCCUPATION
                .filter(scheme -> {

                    return user.getOccupation()
                            .trim()
                            .equalsIgnoreCase(
                                    scheme.getEligibleOccupation()
                                            .trim()
                            );

                })


                // BENEFICIARY CATEGORY
                .filter(scheme -> {

                    String schemeCategory =
                            scheme.getEligibleBeneficiaryCategory();

                    String userCategory =
                            user.getBeneficiaryCategory();

                    if (schemeCategory == null ||
                            schemeCategory.trim().isEmpty()) {

                        return true;
                    }

                    if (schemeCategory.equalsIgnoreCase("ALL")) {

                        return true;
                    }

                    if (userCategory == null ||
                            userCategory.trim().isEmpty()) {

                        return false;
                    }

                    return schemeCategory
                            .trim()
                            .equalsIgnoreCase(
                                    userCategory.trim()
                            );

                })


                // GENDER
                .filter(scheme -> {

                    String schemeGender =
                            scheme.getEligibleGender();

                    String userGender =
                            user.getGender();

                    if (schemeGender == null ||
                            schemeGender.trim().isEmpty()) {

                        return true;
                    }

                    if (schemeGender.equalsIgnoreCase("ALL")) {

                        return true;
                    }

                    if (userGender == null ||
                            userGender.trim().isEmpty()) {

                        return false;
                    }

                    return schemeGender
                            .trim()
                            .equalsIgnoreCase(
                                    userGender.trim()
                            );

                })
                .map(scheme -> {

                    GrantSlab slab =
                            grantslabrepo
                                    .findBySchemeIdAndMinimumIncomeLessThanEqualAndMaximumIncomeGreaterThanEqual(
                                            scheme.getId(),
                                            user.getAnnualIncome(),
                                            user.getAnnualIncome()
                                    )
                                    .orElse(null);


                    // ================= ELIGIBILITY SCORE =================

                    int score = 0;


                    // Age
                    if (age >= scheme.getMinimumAge()
                            && age <= scheme.getMaximumAge()) {

                        score += 20;
                    }


                    // Income
                    if (slab != null) {

                        score += 30;
                    }


                    // Occupation
                    if (scheme.getEligibleOccupation() != null
                            && user.getOccupation() != null
                            && scheme.getEligibleOccupation()
                            .trim()
                            .equalsIgnoreCase(
                                    user.getOccupation().trim()
                            )) {

                        score += 20;
                    }


                    // Gender
                    String schemeGender =
                            scheme.getEligibleGender();

                    if (schemeGender == null
                            || schemeGender.trim().isEmpty()
                            || schemeGender.equalsIgnoreCase("ALL")
                            || schemeGender.trim()
                            .equalsIgnoreCase(
                                    user.getGender().trim()
                            )) {

                        score += 10;
                    }


                    // Beneficiary Category
                    String schemeCategory =
                            scheme.getEligibleBeneficiaryCategory();

                    if (schemeCategory == null
                            || schemeCategory.trim().isEmpty()
                            || schemeCategory.equalsIgnoreCase("ALL")
                            || schemeCategory.trim()
                            .equalsIgnoreCase(
                                    user.getBeneficiaryCategory().trim()
                            )) {

                        score += 20;
                    }


                    return new EligibleSchemeDTO(
                            scheme,
                            slab,
                            score
                    );
                })

                .toList();

    }


    public Scheme updateScheme(
            Long id,
            Scheme updatedScheme) {

        Scheme scheme =
                schemerepo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Scheme not found"
                                )
                        );


        scheme.setSchemeName(
                updatedScheme.getSchemeName()
        );

        scheme.setDescription(
                updatedScheme.getDescription()
        );

        scheme.setMinimumAge(
                updatedScheme.getMinimumAge()
        );

        scheme.setMaximumAge(
                updatedScheme.getMaximumAge()
        );

        scheme.setEligibleOccupation(
                updatedScheme.getEligibleOccupation()
        );

        scheme.setEligibleLocation(
                updatedScheme.getEligibleLocation()
        );

        scheme.setRequiredDocuments(
                updatedScheme.getRequiredDocuments()
        );

        scheme.setStartDate(
                updatedScheme.getStartDate()
        );

        scheme.setEndDate(
                updatedScheme.getEndDate()
        );

        scheme.setStatus(
                updatedScheme.getStatus()
        );

        scheme.setEligibleGender(
                updatedScheme.getEligibleGender()
        );

        scheme.setEligibleBeneficiaryCategory(
                updatedScheme.getEligibleBeneficiaryCategory()
        );


        return schemerepo.save(scheme);
    }

}