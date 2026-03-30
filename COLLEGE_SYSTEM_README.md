# College Admission System - Documentation

## Overview
A complete college admission system that supports three admission pathways:
1. **Cutoff / Counselling** - Based on subject marks
2. **Entrance Exam** - Based on exam scores or ranks
3. **Management Quota** - Based on budget

The system is designed to handle **thousands of colleges** with dynamic data loading from a centralized database.

---

## Project Structure

```
IDEATHON project/
├── data/
│   └── database.json          # Central database (empty placeholders)
├── pages/
│   ├── select-degree.html     # Step 1: Choose degree
│   ├── admission-type.html    # Step 2: Choose admission type
│   ├── cutoff-system.html     # Step 3a: Cutoff admission
│   ├── exam-system.html       # Step 3b: Entrance exam admission
│   ├── management-system.html # Step 3c: Management quota admission
│   ├── colleges-result.html   # Step 4: Display filtered colleges
│   └── college-details.html   # Step 5: College details page
├── scripts/
│   └── college-system.js      # Core system module
├── index.html                 # Homepage (updated with button)
└── style.css                  # Existing styles
```

---

## Database Structure (database.json)

### Empty Template
```json
{
  "degrees": [],
  "subjects": {},
  "cutoff_formula": {},
  "entrance_exams": [],
  "colleges": {
    "cutoff": [],
    "exam": [],
    "management": []
  },
  "management_colleges": []
}
```

### How to Add Data

#### 1. Add Degrees
```json
"degrees": [
  "Engineering",
  "Medical",
  "Nursing",
  "Pharmacy",
  "MBA/Management",
  "Hotel Management"
]
```

#### 2. Add Subjects (per degree)
```json
"subjects": {
  "Engineering": ["Mathematics", "Physics", "Chemistry"],
  "Medical": ["Biology", "Physics", "Chemistry"],
  "Nursing": ["Biology", "Chemistry", "English"]
}
```

#### 3. Add Cutoff Formulas (per degree)
```json
"cutoff_formula": {
  "Engineering": "(marks.Mathematics / 2) + (marks.Physics / 4) + (marks.Chemistry / 4)",
  "Medical": "marks.Biology + marks.Physics + marks.Chemistry"
}
```

#### 4. Add Entrance Exams
```json
"entrance_exams": [
  "TNEA",
  "JEE Main",
  "NEET",
  "TANCET"
]
```

#### 5. Add Colleges (Cutoff-based)
```json
"colleges": {
  "cutoff": [
    {
      "college_name": "IIT Madras",
      "degree": "Engineering",
      "location": "Chennai",
      "cutoff_range": "180-195"
    }
  ],
  "exam": [
    {
      "college_name": "Premier Tech Institute",
      "degree": "Engineering",
      "location": "Chennai",
      "exam_required": "JEE Main",
      "score_range": "95-99 percentile"
    }
  ],
  "management": [
    {
      "college_name": "Global Business School",
      "degree": "MBA/Management",
      "location": "Chennai",
      "fee_range": "1000000-1500000"
    }
  ]
}
```

---

## User Flow

```
Homepage
  ↓
[Choose College Button]
  ↓
Select Degree Page
  ↓ (Select a degree)
Admission Type Page
  ├─→ Cutoff System → Enter Marks → Calculate → View Colleges
  ├─→ Exam System → Enter Score/Rank → Search → View Colleges
  └─→ Management System → Enter Budget → Search → View Colleges
  ↓
Colleges Result Page (with filters)
  ↓ (Click on college)
College Details Page
  ↓
Apply / Go Back
```

---

## Key Features

### 1. Dynamic Data Loading
- All data loaded from `database.json` using `fetch()`
- Cached in memory for performance
- Supports unlimited colleges

### 2. Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly buttons and inputs

### 3. Session Storage
- Stores user selections (degree, admission type, scores)
- Maintains state across page navigation
- No server required

### 4. Filtering & Search
- Search colleges by name
- Filter by location
- Sort by name (ascending/descending)

### 5. Cutoff Calculation
- Dynamic formula evaluation
- Supports weighted calculations
- Flexible subject combinations

---

## JavaScript Module (college-system.js)

### Core Functions

```javascript
// Load database
await window.collegeSystem.loadDatabase()

// Get degrees
await window.collegeSystem.getDegrees()

// Get subjects for degree
await window.collegeSystem.getSubjects(degree)

// Get cutoff formula
await window.collegeSystem.getCutoffFormula(degree)

// Get entrance exams
await window.collegeSystem.getEntranceExams()

// Get colleges by type
await window.collegeSystem.getCollegesByType('cutoff')

// Filter by score
window.collegeSystem.filterByScore(colleges, cutoffScore)

// Filter by budget
window.collegeSystem.filterByBudget(colleges, budget)

// Search by name
window.collegeSystem.searchByName(colleges, searchTerm)

// Filter by location
window.collegeSystem.filterByLocation(colleges, location)

// Get unique locations
window.collegeSystem.getUniqueLocations(colleges)

// Sort by name
window.collegeSystem.sortByName(colleges, 'asc')

// Get college by name
window.collegeSystem.getCollegeByName(colleges, name)

// Validate database
await window.collegeSystem.validateDatabase()
```

---

## How to Add Data

### Step 1: Open database.json
```
data/database.json
```

### Step 2: Add Degrees
Replace the empty `degrees` array with your list of degrees.

### Step 3: Add Subjects
Add subject mappings for each degree in the `subjects` object.

### Step 4: Add Formulas
Add cutoff calculation formulas for each degree.

### Step 5: Add Exams
Add entrance exam names to the `entrance_exams` array.

### Step 6: Add Colleges
Add college data to the appropriate arrays:
- `colleges.cutoff` - For cutoff-based admissions
- `colleges.exam` - For entrance exam-based admissions
- `colleges.management` - For management quota admissions

---

## Example: Adding Pharmacy Colleges

```json
{
  "degrees": ["Pharmacy", "Nursing", "Physiotherapy"],
  "subjects": {
    "Pharmacy": ["Biology", "Chemistry", "Physics"]
  },
  "cutoff_formula": {
    "Pharmacy": "marks.Biology + marks.Chemistry + marks.Physics"
  },
  "entrance_exams": ["NEET"],
  "colleges": {
    "cutoff": [],
    "exam": [],
    "management": [
      {
        "college_name": "JSS College of Pharmacy Ooty",
        "degree": "Pharmacy",
        "location": "Ooty",
        "fee_range": "75000-100000"
      },
      {
        "college_name": "SRM College of Pharmacy Chennai",
        "degree": "Pharmacy",
        "location": "Chennai",
        "fee_range": "150000-200000"
      }
    ]
  }
}
```

---

## Performance Optimization

1. **Database Caching** - Data loaded once and cached in memory
2. **Lazy Loading** - Colleges loaded only when needed
3. **Efficient Filtering** - Uses native JavaScript array methods
4. **Session Storage** - Reduces data transmission

---

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Future Enhancements

1. **Backend Integration** - Connect to a real database
2. **Advanced Filters** - Filter by placement, fees, facilities
3. **College Comparison** - Compare multiple colleges side-by-side
4. **Reviews & Ratings** - User reviews and ratings
5. **Application Tracking** - Track applications and admissions
6. **Notifications** - Email/SMS notifications for updates
7. **Analytics** - Track user behavior and preferences

---

## Troubleshooting

### Issue: Degrees not loading
- Check if `database.json` exists in `/data/` folder
- Verify JSON syntax is valid
- Check browser console for errors

### Issue: Colleges not showing
- Ensure colleges are added to the correct array (cutoff/exam/management)
- Verify college degree matches selected degree
- Check filter criteria

### Issue: Cutoff calculation error
- Verify formula syntax in `cutoff_formula`
- Ensure all subjects in formula exist in `subjects` array
- Check that user entered valid marks

---

## Support

For issues or questions:
1. Check the browser console (F12) for error messages
2. Verify database.json structure
3. Test with sample data first
4. Review the example data structure above

---

## License

This system is part of the CareerForge AI platform.

---

## Version

**v1.0** - Initial Release
- Basic college admission system
- Three admission pathways
- Dynamic data loading
- Responsive design
