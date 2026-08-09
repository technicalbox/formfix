# Data Sources — FormFix

> **Rule**: Requirements must be independently verified against the current official notification before becoming production data. The numbers below are from initial research and carry `status: needs-verification` until confirmed against the specific notification document.

## Source Registry

| Application | Requirement | Official Source | URL | Date Researched | Status | Notes |
|-------------|-------------|----------------|-----|-----------------|--------|-------|
| SSC CGL 2026 | Signature: 10–20 KB, JPG, ~140×60px | SSC Notice of Examination | https://ssc.gov.in | 2026-08-09 | needs-verification | Photo uses live capture; signature still uploaded |
| SSC CHSL 2026 | Signature: 10–20 KB, JPG | SSC Notice of Examination | https://ssc.gov.in | 2026-08-09 | needs-verification | Same portal as CGL |
| UPSC CSE 2026 | Photo: 20–300 KB, 350×350px min, JPG | UPSC Notification | https://upsc.gov.in | 2026-08-09 | needs-verification | Triple signature format required |
| UPSC CSE 2026 | Signature: 20–100 KB, 350×350px min, JPG | UPSC Notification | https://upsc.gov.in | 2026-08-09 | needs-verification | 3 signatures stacked vertically |
| NEET UG 2026 | Photo: 10–200 KB, JPG, white bg | NTA Information Bulletin | https://neet.nta.nic.in | 2026-08-09 | needs-verification | Passport + postcard sizes needed |
| NEET UG 2026 | Signature: 4–30 KB, JPG | NTA Information Bulletin | https://neet.nta.nic.in | 2026-08-09 | needs-verification | Black ink on white paper |
| JEE Main 2026 | Photo: 10–200 KB, JPG, 3.5×4.5cm | NTA Information Bulletin | https://jeemain.nta.nic.in | 2026-08-09 | needs-verification | 80% face coverage required |
| JEE Main 2026 | Signature: 10–100 KB, JPG, 3.5×1.5cm | NTA Information Bulletin | https://jeemain.nta.nic.in | 2026-08-09 | needs-verification | Black or blue ink |
| IBPS PO/Clerk 2026 | Photo: 20–50 KB, 200×230px, JPG | IBPS Notification | https://ibps.in | 2026-08-09 | needs-verification | Passport-style |
| IBPS PO/Clerk 2026 | Signature: 10–20 KB, 140×60px, JPG | IBPS Notification | https://ibps.in | 2026-08-09 | needs-verification | Black ink |
| IBPS PO/Clerk 2026 | Left Thumb: 20–50 KB, 240×240px, JPG | IBPS Notification | https://ibps.in | 2026-08-09 | needs-verification | Blue/black ink |
| IBPS PO/Clerk 2026 | Declaration: 50–100 KB, 800×400px, JPG | IBPS Notification | https://ibps.in | 2026-08-09 | needs-verification | English, black ink |
| RRB General | Photo: 20–100 KB, JPG | CEN Notification | https://indianrailways.gov.in | 2026-08-09 | needs-verification | Varies by CEN; some use live capture |
| RRB General | Signature: 10–50 KB, JPG | CEN Notification | https://indianrailways.gov.in | 2026-08-09 | needs-verification | Running handwriting required |

## Source Priority

1. Official government website (ssc.gov.in, upsc.gov.in, nta.nic.in, ibps.in)
2. Official notification PDF (Notice of Examination, Information Bulletin)
3. Official application portal instructions (upload page)
4. Other authoritative source only when no official source is available

## Verification Protocol

1. Download the current official notification for the exam year
2. Locate the "Instructions for Uploading Photograph and Signature" section
3. Record exact values from the notification
4. Screenshot the relevant section as evidence
5. Update `presets.json` with verified values
6. Set `source.status` to `"verified"`
7. Update this registry with the verification date

## Important Notes

- Requirements can change between notification years
- Some exams (SSC, JEE) now use live photo capture — but users may still need compliant photos for admit cards
- RRB requirements vary by specific CEN (Centralized Employment Notice)
- Always display the notification year in the UI so users know which year the data applies to
