# College Admission System - Data Import Template

## 📋 How to Use This Template

1. Copy the structure below
2. Replace placeholder values with your data
3. Paste into `data/database.json`
4. Refresh the browser

---

## 🎓 Complete Database Template

```json
{
  "degrees": [
    "Engineering",
    "Medical",
    "Nursing",
    "Pharmacy",
    "Physiotherapy",
    "MBA/Management",
    "Hotel Management",
    "Law",
    "Architecture",
    "Arts & Science"
  ],

  "subjects": {
    "Engineering": ["Mathematics", "Physics", "Chemistry"],
    "Medical": ["Biology", "Physics", "Chemistry"],
    "Nursing": ["Biology", "Chemistry", "English"],
    "Pharmacy": ["Biology", "Chemistry", "Physics"],
    "Physiotherapy": ["Biology", "Chemistry", "Physics"],
    "MBA/Management": ["Quantitative", "Reasoning", "English"],
    "Hotel Management": ["Hospitality", "Management", "Communication"],
    "Law": ["English", "Reasoning", "General Knowledge"],
    "Architecture": ["Mathematics", "Physics", "Drawing"],
    "Arts & Science": ["Subject 1", "Subject 2", "Subject 3"]
  },

  "cutoff_formula": {
    "Engineering": "(marks.Mathematics / 2) + (marks.Physics / 4) + (marks.Chemistry / 4)",
    "Medical": "marks.Biology + marks.Physics + marks.Chemistry",
    "Nursing": "marks.Biology + marks.Chemistry + marks.English",
    "Pharmacy": "marks.Biology + marks.Chemistry + marks.Physics",
    "Physiotherapy": "marks.Biology + marks.Chemistry + marks.Physics",
    "MBA/Management": "(marks.Quantitative * 0.4) + (marks.Reasoning * 0.3) + (marks.English * 0.3)",
    "Hotel Management": "(marks.Hospitality * 0.4) + (marks.Management * 0.3) + (marks.Communication * 0.3)",
    "Law": "marks.English + marks.Reasoning + marks.GeneralKnowledge",
    "Architecture": "(marks.Mathematics * 0.5) + (marks.Physics * 0.25) + (marks.Drawing * 0.25)",
    "Arts & Science": "Object.values(marks).reduce((a, b) => a + b, 0) / Object.keys(marks).length"
  },

  "entrance_exams": [
    "TNEA",
    "JEE Main",
    "JEE Advanced",
    "NEET",
    "TANCET",
    "GATE",
    "CLAT",
    "CAT",
    "GMAT"
  ],

  "colleges": {
    "cutoff": [
      {
        "college_name": "IIT Madras",
        "degree": "Engineering",
        "location": "Chennai",
        "cutoff_range": "180-195"
      },
      {
        "college_name": "NIT Tiruchirappalli",
        "degree": "Engineering",
        "location": "Tiruchirappalli",
        "cutoff_range": "160-175"
      }
    ],

    "exam": [
      {
        "college_name": "IIT Madras",
        "degree": "Engineering",
        "location": "Chennai",
        "exam_required": "JEE Main",
        "score_range": "95-99 percentile"
      },
      {
        "college_name": "Madras Medical College",
        "degree": "Medical",
        "location": "Chennai",
        "exam_required": "NEET",
        "score_range": "600-720"
      }
    ],

    "management": [
      {
        "college_name": "SRM College of Pharmacy",
        "degree": "Pharmacy",
        "location": "Chennai",
        "fee_range": "150000-200000"
      },
      {
        "college_name": "PSG College of Pharmacy",
        "degree": "Pharmacy",
        "location": "Coimbatore",
        "fee_range": "100000-150000"
      },
      {
        "college_name": "SRM College of Nursing",
        "degree": "Nursing",
        "location": "Chennai",
        "fee_range": "120000-160000"
      },
      {
        "college_name": "PSG Institute of Management",
        "degree": "MBA/Management",
        "location": "Coimbatore",
        "fee_range": "1500000-2000000"
      }
    ]
  },

  "management_colleges": []
}
```

---

## 🏥 Pharmacy Colleges Template

```json
{
  "degrees": ["Pharmacy"],
  "subjects": {
    "Pharmacy": ["Biology", "Chemistry", "Physics"]
  },
  "cutoff_formula": {
    "Pharmacy": "marks.Biology + marks.Chemistry + marks.Physics"
  },
  "entrance_exams": ["NEET"],
  "colleges": {
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
      },
      {
        "college_name": "Saveetha College of Pharmacy Chennai",
        "degree": "Pharmacy",
        "location": "Chennai",
        "fee_range": "125000-175000"
      },
      {
        "college_name": "Sri Ramachandra College of Pharmacy Chennai",
        "degree": "Pharmacy",
        "location": "Chennai",
        "fee_range": "150000-200000"
      },
      {
        "college_name": "PSG College of Pharmacy Coimbatore",
        "degree": "Pharmacy",
        "location": "Coimbatore",
        "fee_range": "100000-150000"
      },
      {
        "college_name": "KMCH College of Pharmacy Coimbatore",
        "degree": "Pharmacy",
        "location": "Coimbatore",
        "fee_range": "90000-120000"
      }
    ]
  }
}
```

---

## 🏥 Nursing Colleges Template

```json
{
  "degrees": ["Nursing"],
  "subjects": {
    "Nursing": ["Biology", "Chemistry", "English"]
  },
  "cutoff_formula": {
    "Nursing": "marks.Biology + marks.Chemistry + marks.English"
  },
  "entrance_exams": ["NEET"],
  "colleges": {
    "management": [
      {
        "college_name": "SRM College of Nursing Chennai",
        "degree": "Nursing",
        "location": "Chennai",
        "fee_range": "120000-160000"
      },
      {
        "college_name": "Saveetha College of Nursing Chennai",
        "degree": "Nursing",
        "location": "Chennai",
        "fee_range": "100000-140000"
      },
      {
        "college_name": "Sri Ramachandra College of Nursing Chennai",
        "degree": "Nursing",
        "location": "Chennai",
        "fee_range": "120000-150000"
      },
      {
        "college_name": "PSG College of Nursing Coimbatore",
        "degree": "Nursing",
        "location": "Coimbatore",
        "fee_range": "90000-120000"
      }
    ]
  }
}
```

---

## 💼 MBA/Management Colleges Template

```json
{
  "degrees": ["MBA/Management"],
  "subjects": {
    "MBA/Management": ["Quantitative", "Reasoning", "English"]
  },
  "cutoff_formula": {
    "MBA/Management": "(marks.Quantitative * 0.4) + (marks.Reasoning * 0.3) + (marks.English * 0.3)"
  },
  "entrance_exams": ["CAT", "GMAT", "TANCET"],
  "colleges": {
    "management": [
      {
        "college_name": "PSG Institute of Management Coimbatore",
        "degree": "MBA/Management",
        "location": "Coimbatore",
        "fee_range": "1500000-2000000"
      },
      {
        "college_name": "Great Lakes Institute of Management Chennai",
        "degree": "MBA/Management",
        "location": "Chennai",
        "fee_range": "3500000-5000000"
      },
      {
        "college_name": "Loyola Institute of Business Administration Chennai",
        "degree": "MBA/Management",
        "location": "Chennai",
        "fee_range": "2000000-2500000"
      }
    ]
  }
}
```

---

## 🏨 Hotel Management Colleges Template

```json
{
  "degrees": ["Hotel Management"],
  "subjects": {
    "Hotel Management": ["Hospitality", "Management", "Communication"]
  },
  "cutoff_formula": {
    "Hotel Management": "(marks.Hospitality * 0.4) + (marks.Management * 0.3) + (marks.Communication * 0.3)"
  },
  "entrance_exams": ["NATA"],
  "colleges": {
    "management": [
      {
        "college_name": "SRM Institute of Hotel Management Chennai",
        "degree": "Hotel Management",
        "location": "Chennai",
        "fee_range": "1200000-1600000"
      },
      {
        "college_name": "PSG Institute of Hotel Management Coimbatore",
        "degree": "Hotel Management",
        "location": "Coimbatore",
        "fee_range": "900000-1200000"
      }
    ]
  }
}
```

---

## 📝 Bulk Import Format

For importing large datasets, use this CSV-to-JSON converter format:

### CSV Format (for management colleges)
```
college_name,degree,location,fee_range
JSS College of Pharmacy Ooty,Pharmacy,Ooty,75000-100000
SRM College of Pharmacy Chennai,Pharmacy,Chennai,150000-200000
Saveetha College of Pharmacy Chennai,Pharmacy,Chennai,125000-175000
```

### Convert to JSON
```json
"colleges": {
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
```

---

## ✅ Validation Checklist

Before importing data, verify:

- [ ] All college names are unique
- [ ] Degrees match those in `degrees` array
- [ ] Locations are consistent (no typos)
- [ ] Fee ranges use format: "min-max"
- [ ] Cutoff ranges use format: "min-max"
- [ ] Exam names match `entrance_exams` array
- [ ] JSON syntax is valid (use JSONLint.com)
- [ ] All required fields are present

---

## 🚀 Quick Import Steps

1. **Prepare Data** - Organize your college data
2. **Format JSON** - Use templates above
3. **Validate** - Check JSON syntax
4. **Copy** - Copy to database.json
5. **Test** - Refresh browser and test
6. **Verify** - Check if colleges appear

---

## 💡 Tips

- Start with 10-20 colleges for testing
- Use consistent location names
- Double-check fee ranges
- Test each degree separately
- Use sample data first

---

## 📞 Need Help?

Refer to:
- `COLLEGE_SYSTEM_README.md` - Full documentation
- `QUICK_START.md` - Quick start guide
- `database-sample.json` - Sample data

---

**Ready to import? Let's go! 🎉**
