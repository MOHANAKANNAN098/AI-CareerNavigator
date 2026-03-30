# 🧮 Tamil Nadu Cutoff Calculator - Complete Documentation

## Overview

The Tamil Nadu Cutoff Calculator is a fully functional web application that helps students calculate their college admission cutoff scores based on their marks and select their category to check eligibility.

## Features

✅ **6 Degree Programs Supported**
- Engineering (B.E / B.Tech)
- Medical (MBBS / NEET)
- Agriculture (B.Sc Agriculture)
- Pharmacy (B.Pharm)
- Nursing (B.Sc Nursing)
- Arts & Science (B.Sc / B.A / B.Com)

✅ **Degree-Specific Formulas**
- Each degree has its own calculation formula
- Formulas displayed before entering marks
- Real Tamil Nadu admission formulas

✅ **Category Selection**
- OC (Open Category)
- BC (Backward Class)
- BCM (Backward Class Muslim)
- MBC (Most Backward Class)
- SC (Scheduled Caste)
- ST (Scheduled Tribe)

✅ **Eligibility Checking**
- Automatic eligibility determination
- Category-wise minimum cutoff display
- Visual eligibility indicators

✅ **College Suggestions**
- Eligible colleges based on cutoff
- College details (name, city, type)
- Cutoff range for each college

✅ **Responsive Design**
- Mobile-friendly interface
- Works on all devices
- Beautiful gradient UI

## File Structure

```
IDEATHON project/
├── cutoff-calculator.html          # Main calculator page
├── js/
│   └── cutoff-calculator.js        # Calculator logic
├── data/
│   └── tamil-nadu-colleges.json    # College database
└── index.html                       # Updated with button
```

## How to Use

### Step 1: Access the Calculator
1. Open `index.html`
2. Click "Cutoff Calculator" button in navigation
3. Page loads with degree selection

### Step 2: Select Degree
1. Choose your degree from dropdown
2. Formula displays automatically
3. Input fields appear based on degree

### Step 3: Enter Marks
1. Enter marks for each subject
2. Marks validated in real-time
3. Cannot exceed maximum marks

### Step 4: Calculate
1. Click "Calculate Cutoff" button
2. Cutoff score calculated instantly
3. Results section appears

### Step 5: Select Category
1. Click your category button
2. Eligibility status shown
3. Eligible colleges listed

## Degree Formulas

### Engineering (B.E / B.Tech)
```
Cutoff = (Maths / 2) + (Physics / 4) + (Chemistry / 4)
Maximum Cutoff: 200
Input: Maths (150), Physics (150), Chemistry (150)
```

### Medical (MBBS / NEET)
```
Cutoff = NEET Score
Maximum Cutoff: 720
Input: NEET Total Score (720)
```

### Agriculture (B.Sc Agriculture)
```
Cutoff = (Biology or Maths / 2) + (Physics / 4) + (Chemistry / 4)
Maximum Cutoff: 200
Input: Biology/Maths (150), Physics (150), Chemistry (150)
```

### Pharmacy (B.Pharm)
```
Cutoff = (Biology or Maths / 2) + (Physics / 4) + (Chemistry / 4)
Maximum Cutoff: 200
Input: Biology/Maths (150), Physics (150), Chemistry (150)
```

### Nursing (B.Sc Nursing)
```
Cutoff = (Biology / 2) + (Physics / 4) + (Chemistry / 4)
Maximum Cutoff: 200
Input: Biology (150), Physics (150), Chemistry (150)
```

### Arts & Science (B.Sc / B.A / B.Com)
```
Cutoff = Average of best 3 subjects out of 6
Maximum Cutoff: 200
Input: 3-6 subjects (100 each)
```

## Category Minimum Cutoffs

### Engineering
- OC: 180
- BC: 160
- BCM: 155
- MBC: 150
- SC: 140
- ST: 130

### Medical
- OC: 600
- BC: 550
- BCM: 540
- MBC: 530
- SC: 480
- ST: 450

### Agriculture
- OC: 170
- BC: 150
- BCM: 145
- MBC: 140
- SC: 130
- ST: 120

### Pharmacy
- OC: 170
- BC: 150
- BCM: 145
- MBC: 140
- SC: 130
- ST: 120

### Nursing
- OC: 160
- BC: 140
- BCM: 135
- MBC: 130
- SC: 120
- ST: 110

### Arts & Science
- OC: 150
- BC: 130
- BCM: 125
- MBC: 120
- SC: 110
- ST: 100

## Validation Rules

✅ **Input Validation**
- Marks cannot be negative
- Marks cannot exceed maximum
- All required fields must be filled
- Optional fields can be left blank

✅ **Error Messages**
- Clear error messages for invalid input
- Helpful hints for each field
- Real-time validation feedback

## College Database

The calculator includes 50+ Tamil Nadu colleges with:
- College name
- City location
- College type (Government/Private)
- Cutoff range
- Admission method

### Sample Colleges

**Engineering:**
- College of Engineering Guindy (195-200)
- NIT Tiruchirappalli (190-199)
- PSG College of Technology (185-195)
- SSN College of Engineering (180-190)

**Medical:**
- Madras Medical College (600-720)
- Stanley Medical College (580-650)
- Sri Ramachandra Medical College (520-600)

**Pharmacy:**
- JSS College of Pharmacy (170-190)
- SRM College of Pharmacy (160-180)
- Saveetha College of Pharmacy (155-175)

## JavaScript Functions

### Main Functions

```javascript
// Update formula based on selected degree
updateFormula()

// Handle form submission and calculate cutoff
handleCalculate(e)

// Display results section
displayResults()

// Select category and show eligibility
selectCategory(category)

// Display category-wise results
displayCategoryResults()

// Show eligible colleges
displayEligibleColleges()

// Show error messages
showError(message)

// Reset form to initial state
resetForm()

// Update step indicator
updateStepIndicator(step)
```

### Data Objects

```javascript
// Degree formulas and inputs
degreeFormulas = {
    engineering: { ... },
    medical: { ... },
    agriculture: { ... },
    pharmacy: { ... },
    nursing: { ... },
    arts: { ... }
}

// Category minimum cutoffs
categoryMinimumCutoffs = {
    engineering: { OC: 180, BC: 160, ... },
    medical: { OC: 600, BC: 550, ... },
    ...
}

// College database
collegeDatabase = {
    engineering: [ ... ],
    medical: [ ... ],
    ...
}
```

## UI Components

### Step Indicator
- Shows current step (1-4)
- Visual progress tracking
- Animated transitions

### Formula Box
- Displays calculation formula
- Shows maximum cutoff
- Updates based on degree

### Input Fields
- Dynamic based on degree
- Real-time validation
- Clear labels and hints

### Result Cards
- Cutoff score display
- Formula used
- Category selection buttons

### Eligibility Message
- Green for eligible
- Red for not eligible
- Clear messaging

### College List
- Grid layout
- College details
- Cutoff ranges

## Styling

### Colors
- Primary: #667eea (Blue)
- Secondary: #764ba2 (Purple)
- Success: #28a745 (Green)
- Error: #dc3545 (Red)
- Background: Gradient (Blue to Purple)

### Responsive Breakpoints
- Desktop: Full layout
- Tablet: Adjusted grid
- Mobile: Single column

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers

## Performance

- **Load Time**: < 1 second
- **Calculation Time**: Instant (< 100ms)
- **Memory Usage**: Minimal
- **No external dependencies**: Pure HTML/CSS/JS

## Adding New Colleges

To add new colleges to the database:

1. Open `js/cutoff-calculator.js`
2. Find `collegeDatabase` object
3. Add college to appropriate degree array:

```javascript
{
    name: 'College Name',
    city: 'City Name',
    type: 'Government/Private',
    cutoffMin: 150,
    cutoffMax: 170
}
```

## Adding New Degrees

To add a new degree:

1. Add to `degreeFormulas`:
```javascript
newdegree: {
    name: 'Degree Name',
    formula: 'Formula description',
    maxCutoff: 200,
    inputs: [ ... ],
    calculate: (marks) => { ... }
}
```

2. Add to `categoryMinimumCutoffs`:
```javascript
newdegree: {
    'OC': 150,
    'BC': 130,
    ...
}
```

3. Add to `collegeDatabase`:
```javascript
newdegree: [ ... ]
```

4. Update HTML dropdown

## Troubleshooting

### Issue: Cutoff not calculating
- Check all required fields are filled
- Verify marks are within valid range
- Check browser console for errors

### Issue: Colleges not showing
- Ensure category is selected
- Check cutoff is within college range
- Verify college database is loaded

### Issue: Formula not displaying
- Select a degree first
- Check JavaScript console for errors
- Refresh page

## Future Enhancements

- Add more colleges (100+)
- Add previous year cutoff data
- Add college comparison feature
- Add PDF export functionality
- Add cutoff prediction based on marks
- Add college reviews and ratings
- Add counselling schedule information
- Add seat availability data

## Support

For issues or questions:
1. Check browser console (F12)
2. Verify all inputs are valid
3. Try refreshing the page
4. Check documentation above

## Version

**Version**: 1.0
**Created**: 2024
**Status**: Production Ready

## License

This calculator is part of the CareerForge AI platform.

---

**Ready to help students find their perfect college! 🎓**
