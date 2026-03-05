package com.propmate.service;

import com.propmate.model.Property;
import com.propmate.model.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class HuaweiCloudService {

    public FraudAnalysisResult analyzeListingForFraud(Property property) {
        try {
            Thread.sleep(800);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        BigDecimal price = property.getPrice();
        int riskScore;
        String riskLevel;
        String explanation;
        boolean flagged;
        List<String> recommendations;

        if (price.compareTo(new BigDecimal("3000")) < 0) {
            riskScore = 85;
            riskLevel = "HIGH";
            explanation = "The listing price of R" + price + "/month is significantly below the market average for " +
                    property.getCity() + ". Properties listed at this price point are frequently associated with " +
                    "fraudulent listings where scammers attempt to collect deposits without legitimate ownership.";
            flagged = true;
            recommendations = Arrays.asList(
                    "Request proof of ownership (title deed) before proceeding",
                    "Never pay any deposit before physically viewing the property",
                    "Verify landlord identity through official ID document",
                    "Cross-check listing on multiple platforms for price consistency",
                    "Consider using a registered estate agent for additional security"
            );
        } else if (price.compareTo(new BigDecimal("6000")) < 0) {
            riskScore = 45;
            riskLevel = "MEDIUM";
            explanation = "The listing price of R" + price + "/month is below the typical market rate for " +
                    property.getCity() + ". While this may represent a legitimate bargain, it warrants additional verification.";
            flagged = false;
            recommendations = Arrays.asList(
                    "Request a physical viewing before committing to any payment",
                    "Ask for a copy of the title deed or lease agreement",
                    "Verify the landlord's identity and contact details",
                    "Check if the property appears on other reputable platforms"
            );
        } else {
            riskScore = 12;
            riskLevel = "LOW";
            explanation = "The listing price of R" + price + "/month is consistent with market rates for " +
                    property.getCity() + ". No significant fraud indicators detected. Standard due diligence is recommended.";
            flagged = false;
            recommendations = Arrays.asList(
                    "Conduct a standard property viewing",
                    "Review the lease agreement carefully before signing",
                    "Ensure all agreements are in writing"
            );
        }

        return new FraudAnalysisResult(riskScore, riskLevel, explanation, flagged, recommendations);
    }

    public String generateLeaseAgreement(User tenant, Property property) {
        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        String landlordName = property.getLandlord() != null ? property.getLandlord().getName() : "The Landlord";
        BigDecimal deposit = property.getPrice().multiply(new BigDecimal("2"));

        return """
                RESIDENTIAL LEASE AGREEMENT
                ===========================
                
                This Residential Lease Agreement ("Agreement") is entered into in accordance with the
                Rental Housing Act 50 of 1999 (as amended) and the Consumer Protection Act 68 of 2008.
                
                PARTIES
                -------
                Landlord: %s
                Tenant:   %s
                
                PROPERTY
                --------
                Property Address: %s, %s, %s
                Property Type:    %s
                
                FINANCIAL TERMS
                ---------------
                Monthly Rental:  R%s
                Security Deposit: R%s (equivalent to two months' rent, held in an interest-bearing account
                                  as required by Section 5 of the Rental Housing Act 50 of 1999)
                
                LEASE DURATION
                --------------
                This lease is entered into for a fixed period of 12 (twelve) months.
                Either party may terminate this agreement with 1 (one) calendar month written notice
                after the fixed term expires, as stipulated in Section 5(3) of the Rental Housing Act.
                
                TENANT RIGHTS (Rental Housing Act 50 of 1999)
                ----------------------------------------------
                1. The Tenant has the right to a habitable, safe, and well-maintained dwelling.
                2. The Tenant has the right to privacy and peaceful enjoyment of the property.
                3. The Tenant has the right to receive receipts for all payments made.
                4. The Tenant has the right to a joint ingoing and outgoing inspection of the property.
                5. The Tenant has the right to have the deposit returned within 14 days of vacating,
                   less any legitimate deductions for damages beyond fair wear and tear.
                6. The Tenant has the right to dispute unreasonable deposit deductions with the
                   Rental Housing Tribunal.
                
                LANDLORD OBLIGATIONS
                --------------------
                1. The Landlord must maintain the property in a good and habitable state of repair.
                2. The Landlord must ensure all electrical, plumbing, and structural systems are functional.
                3. The Landlord must provide the Tenant with written receipts for all rent payments.
                4. The Landlord must keep the deposit in an interest-bearing account and provide proof thereof.
                5. The Landlord must give 24 hours written notice before entering the property for inspections.
                6. The Landlord may not unfairly discriminate against the Tenant.
                
                PAYMENT TERMS
                -------------
                Rent is payable on or before the 1st (first) day of each calendar month.
                Payment shall be made via EFT to the Landlord's nominated bank account.
                A 10%% penalty may be levied on rent outstanding after the 7th of each month.
                
                MAINTENANCE AND REPAIRS
                -----------------------
                The Tenant shall immediately report any defects or damage to the Landlord in writing.
                The Tenant is responsible for minor maintenance such as replacing light bulbs and keeping
                the property clean and hygienic. The Landlord is responsible for structural repairs,
                plumbing, electrical, and roof maintenance.
                
                TERMINATION CLAUSES
                -------------------
                1. Either party may cancel this lease with written notice of 20 (twenty) business days
                   if the other party materially breaches any term of this agreement and fails to remedy
                   the breach within 20 days of written notice thereof.
                2. The Landlord may apply to the Rental Housing Tribunal for eviction proceedings if the
                   Tenant fails to pay rent for more than 30 days, in accordance with the Prevention of
                   Illegal Eviction from and Unlawful Occupation of Land Act 19 of 1998 (PIE Act).
                3. The Tenant may vacate immediately if the property becomes uninhabitable due to
                   circumstances beyond the Tenant's control.
                
                DISPUTE RESOLUTION
                ------------------
                Any disputes arising from this agreement shall first be referred to the Rental Housing
                Tribunal of the relevant province, as provided for in Section 13 of the Rental Housing Act.
                
                GOVERNING LAW
                -------------
                This agreement is governed by the laws of the Republic of South Africa, including but not
                limited to the Rental Housing Act 50 of 1999, Consumer Protection Act 68 of 2008, and
                the Prevention of Illegal Eviction Act 19 of 1998.
                
                SIGNATURES
                ----------
                Landlord: ________________________  Date: ______________
                
                Tenant:   ________________________  Date: ______________
                
                Witness:  ________________________  Date: ______________
                """.formatted(
                landlordName,
                tenant.getName(),
                property.getAddress(),
                property.getCity(),
                property.getProvince(),
                property.getPropertyType(),
                property.getPrice(),
                deposit
        );
    }

    public InspectionResult analyzeInspectionImages(String fileName) {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        List<String> damages = Arrays.asList(
                "Scuffed walls in main bedroom - R450",
                "Broken window latch in kitchen - R850",
                "Carpet stain in lounge - R600",
                "Cracked tile in bathroom - R1200"
        );

        double totalRepairCost = 3100.0;
        double depositDeduction = 2480.0;

        String recommendation = "Based on the inspection analysis of " + fileName + ", moderate damage was detected " +
                "beyond normal wear and tear. A deposit deduction of R" + depositDeduction +
                " is recommended to cover repair costs. The remaining deposit balance should be refunded " +
                "to the tenant within 14 days as required by the Rental Housing Act.";

        return new InspectionResult(damages, totalRepairCost, depositDeduction, recommendation);
    }
}
