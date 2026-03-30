# College Admission System - Quick Start Guide

## 🚀 Getting Started

### Step 1: Test with Sample Data
1. Open `data/database-sample.json`
2. Copy all content
3. Open `data/database.json`
4. Paste the sample data
5. Save the file

### Step 2: Run the System
1. Open `index.html` in your browser
2. Click the **"Choose College"** button
3. Follow the flow:
   - Select a degree
   - Choose admission type
   - Enter your details
   - View matching colleges

---

## 📊 Adding Your Own Data

### Quick Reference: College Data Format

#### For Cutoff-Based Admissions
```json
{
  "college_name": "College Name",
  "degree": "Engineering",
  "location": "City Name",
  "cutoff_range": "150-170"
}
```

#### For Entrance Exam Admissions
```json
{
  "college_name": "College Name",
  "degree": "Medical",
  "location": "City Name",
  "exam_required": "NEET",
  "score_range": "600-720"
}
```

#### For Management Quota Admissions
```json
{
  "college_name": "College Name",
  "degree": "Pharmacy",
  "location": "City Name",
  "fee_range": "100000-150000"
}
```

---

## 🎯 Common Tasks

### Add a New Degree
1. Open `data/database.json`
2. Add degree name to `degrees` array:
   ```json
   "degrees": ["Engineering", "Medical", "Your New Degree"]
   ```
3. Add subjects for the degree:
   ```json
   "subjects": {
     "Your New Degree": ["Subject 1", "Subject 2", "Subject 3"]
   }
   ```
4. Add cutoff formula:
   ```json
   "cutoff_formula": {
     "Your New Degree": "marks.Subject1 + marks.Subject2 + marks.Subject3"
   }
   ```

### Add Multiple Colleges
1. Open `data/database.json`
2. Add colleges to the appropriate array:
   - `colleges.cutoff` - For cutoff-based
   - `colleges.exam` - For entrance exam
   - `colleges.management` - For management quota

Example:
```json
"colleges": {
  "management": [
    {
      "college_name": "College 1",
      "degree": "Pharmacy",
      "location": "Chennai",
      "fee_range": "100000-150000"
    },
    {
      "college_name": "College 2",
      "degree": "Pharmacy",
      "location": "Coimbatore",
      "fee_range": "80000-120000"
    }
  ]
}
```

### Add Entrance Exams
1. Open `data/database.json`
2. Add exam names to `entrance_exams` array:
   ```json
   "entrance_exams": ["TNEA", "JEE Main", "NEET", "Your Exam"]
   ```

---

## 🔍 Testing the System

### Test Cutoff System
1. Click "Choose College"
2. Select "Engineering"
3. Select "Cutoff / Counselling"
4. Enter marks (e.g., Math: 90, Physics: 85, Chemistry: 80)
5. Click "Calculate Cutoff"
6. Click "Generate Colleges"
7. View matching colleges

### Test Entrance Exam System
1. Click "Choose College"
2. Select "Medical"
3. Select "Entrance Exam"
4. Select "NEET"
5. Enter score (e.g., 650)
6. Click "Search Colleges"
7. View matching colleges

### Test Management Quota System
1. Click "Choose College"
2. Select "Pharmacy"
3. Select "Management Quota"
4. Enter budget (e.g., 150000)
5. Click "Search Colleges"
6. View matching colleges

---

## 📝 Data Entry Tips

### Cutoff Ranges
- Use format: "150-170"
- Represents minimum and maximum cutoff scores
- Example: "180-195" means cutoff between 180 and 195

### Fee Ranges
- Use format: "100000-150000"
- Represents minimum and maximum annual fees
- Can use commas: "1,00,000-1,50,000"

### Score Ranges
- Use format: "95-99 percentile" or "600-720"
- Flexible format for different exam types

### Locations
- Use consistent city names
- Examples: "Chennai", "Coimbatore", "Madurai"
- System filters by exact match

---

## 🛠️ Troubleshooting

### Problem: Degrees not showing
**Solution:** Check if degrees array is not empty in database.json

### Problem: Colleges not appearing
**Solution:** 
- Verify college degree matches selected degree
- Check if college is in correct array (cutoff/exam/management)
- Ensure location is spelled correctly

### Problem: Cutoff calculation error
**Solution:**
- Check formula syntax in cutoff_formula
- Verify all subjects in formula exist in subjects array
- Ensure marks are valid numbers

### Problem: Filters not working
**Solution:**
- Refresh the page
- Check browser console for errors
- Verify database.json is valid JSON

---

## 📱 Mobile Testing

The system is fully responsive. Test on:
- iPhone (Safari)
- Android (Chrome)
- Tablets (iPad, Android tablets)
- Desktop browsers

---

## 🎓 Example: Adding Pharmacy Colleges

### Step 1: Add Degree
```json
"degrees": ["Pharmacy"]
```

### Step 2: Add Subjects
```json
"subjects": {
  "Pharmacy": ["Biology", "Chemistry", "Physics"]
}
```

### Step 3: Add Formula
```json
"cutoff_formula": {
  "Pharmacy": "marks.Biology + marks.Chemistry + marks.Physics"
}
```

### Step 4: Add Colleges
```json
"colleges": {
  "management": [
    {
      "college_name": "JSS College of Pharmacy",
      "degree": "Pharmacy",
      "location": "Ooty",
      "fee_range": "75000-100000"
    },
    {
      "college_name": "SRM College of Pharmacy",
      "degree": "Pharmacy",
      "location": "Chennai",
      "fee_range": "150000-200000"
    }
  ]
}
```

---

## 📊 Performance Notes

- System handles **1000+ colleges** efficiently
- Data cached in memory after first load
- Filtering happens instantly
- No server required

---

## 🔐 Data Validation

The system validates:
- ✅ Database structure
- ✅ Required fields
- ✅ Data types
- ✅ Formula syntax

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Verify database.json syntax
3. Test with sample data
4. Review error messages

---

## 🎉 You're Ready!

Your college admission system is now ready to use. Start adding your college data and help students find their perfect college!

**Happy coding! 🚀**
