# Quick Test Data for New Form Structure

Use this test data to verify the form works correctly after the restructure.

## Test Patient Data

### I. Patient Demographics
- **Date**: Today's date (auto-filled)
- **Name**: `Test Patient - Ravi Kumar`
- **Age**: `45`
- **Sex**: `Male`
- **Occupation**: `Software Engineer`
- **Phone Number**: `9876543210`
- **Height**: `170 cm`
- **Weight**: `75 kg`
- **Blood Pressure**: `120/80`
- **Sugar Level**: `110 mg/dL`

### II. Clinical History
- **Chief Complaints**: `Lower back pain radiating to left leg for 2 weeks`
- **Present History**: `Pain started after lifting heavy object, worsening on sitting`
- **Past Medical History**: `Type 2 Diabetes - controlled`
- **Diagnostic Image Reports**: `X-ray shows L4-L5 disc space narrowing`
- **Red Flags**: `No bowel/bladder involvement, no progressive weakness`

### III. Observation & Physical Examination
- **On Observation**: `Mild forward lean posture, guarded movements`
- **Active ROM**: `Flexion 40°, Extension 10°`
- **Passive ROM**: `Flexion 50°, Extension 15°`
- **Muscle Power**: `4/5 Left leg`
- **Palpation**: `Tenderness L4-L5 paraspinal muscles`
- **Gait**: `Antalgic gait favoring left side`
- **Sensation**: `Reduced L5 dermatome`
- **Reflexes**: `Knee jerk normal, ankle jerk diminished left`
- **Special Tests**: `SLR positive 45° left`

### IV. Pain Assessment
- **Pain History**: `Chronic episodes over 6 months`
- **Aggravating Factors**: `Prolonged sitting, bending forward`
- **Easing Factors**: `Lying down, heat application`
- **Type of Pain**: `Burning and shooting down the leg`
- **VAS Score**: `7`
- **Symptoms Location**: `Lower back radiating to left buttock and posterior thigh`

### V. Diagnosis & Treatment Plan
- **Diagnosis**: `Lumbar radiculopathy - L5 nerve root involvement`
- **Treatment Plan**: `6 weeks conservative management`
- **Manual Therapy**: `Spinal mobilization, soft tissue release`
- **Electrotherapy**: `TENS, Ultrasound to lumbar region`
- **Exercise Prescription**: `Core strengthening, McKenzie exercises`
- **Patient Education**: `Posture correction, ergonomic advice`
- **Home Follow-ups**: `Daily stretching, hot pack application`
- **Treatment Given**: `Initial assessment and TENS today`

### VI. Summary & Follow-up
- **Patient Summary**: `45-year-old male with L5 radiculopathy, moderate severity, good prognosis with conservative treatment`
- **Review 1**: `Follow up in 1 week`
- **Review 2**: (leave empty)
- **Review 3**: (leave empty)

---

## Steps to Test

1. Go to: https://prasad-physio-database.vercel.app/new
2. Fill in the form with the data above
3. Click "Save Assessment"
4. Verify you are redirected to the dashboard with success message
5. Check the Google Sheet for the new entry

## Expected Google Sheet Columns

All 54 columns should be populated correctly according to the new structure.
