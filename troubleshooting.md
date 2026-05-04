# 🔧 Troubleshooting Guide

## ❌ Common Errors & Fixes

### Error 1: "No degrees available"
**Cause**: `database.json` is empty or missing degrees

**Fix**:
1. Open `data/database.json`
2. Copy content from `data/database-sample.json`
3. Paste into `database.json`
4. Refresh browser

---

### Error 2: "Error loading degrees"
**Cause**: Invalid JSON syntax in `database.json`

**Fix**:
1. Open `data/database.json`
2. Check for syntax errors:
   - Missing commas
   - Unclosed brackets
   - Quotes not matching
3. Use JSONLint.com to validate
4. Fix errors and save
5. Refresh browser

---

### Error 3: "No subjects configured"
**Cause**: Subjects not added for selected degree

**Fix**:
1. Open `data/database.json`
2. Add subjects for degree:
```json
"subjects": {
  "Engineering": ["Mathematics", "Physics", "Chemistry"]
}
```
3. Save and refresh

---

### Error 4: "No entrance exams configured"
**Cause**: Entrance exams array is empty

**Fix**:
1. Open `data/database.json`
2. Add exams:
```json
"entrance_exams": ["NEET", "JEE Main", "TANCET"]
```
3. Save and refresh

---

### Error 5: "No colleges found"
**Cause**: Colleges not added or degree doesn't match

**Fix**:
1. Open `data/database.json`
2. Add colleges:
```json
"colleges": {
  "management": [
    {
      "college_name": "College Name",
      "degree": "Engineering",
      "location": "City",
      "fee_range": "100000-150000"
    }
  ]
}
```
3. Ensure degree matches selected degree
4. Save and refresh

---

### Error 6: "Cutoff calculation error"
**Cause**: Formula syntax error or missing subjects

**Fix**:
1. Check formula in `database.json`:
```json
"cutoff_formula": {
  "Engineering": "(marks.Mathematics / 2) + (marks.Physics / 4) + (marks.Chemistry / 4)"
}
```
2. Verify all subjects in formula exist in subjects array
3. Check for typos in subject names
4. Save and refresh

---

### Error 7: "Blank page or nothing loads"
**Cause**: JavaScript error or path issue

**Fix**:
1. Open browser console (F12)
2. Check for red errors
3. Verify `data/database.json` exists
4. Check file paths are correct
5. Refresh page (Ctrl+F5)

---

### Error 8: "Filters not working"
**Cause**: Page not refreshed after data change

**Fix**:
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Close and reopen browser
4. Try in incognito mode

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console
1. Press F12
2. Go to Console tab
3. Look for red error messages
4. Note the error details

### Step 2: Validate JSON
1. Open `data/database.json`
2. Copy all content
3. Go to JSONLint.com
4. Paste content
5. Click "Validate JSON"
6. Fix any errors shown

### Step 3: Check File Paths
1. Verify `data/database.json` exists
2. Verify `scripts/college-system.js` exists
3. Verify all page files exist in `pages/` folder
4. Check file names for typos

### Step 4: Test with Sample Data
1. Open `data/database-sample.json`
2. Copy all content
3. Paste into `data/database.json`
4. Refresh browser
5. Test if system works

---

## ✅ Verification Checklist

- [ ] `data/database.json` exists
- [ ] `data/database.json` has valid JSON
- [ ] `degrees` array is not empty
- [ ] `subjects` object has entries
- [ ] `cutoff_formula` object has entries
- [ ] `entrance_exams` array is not empty
- [ ] `colleges` object has entries
- [ ] All college degrees match degrees array
- [ ] All formulas have correct syntax
- [ ] Browser console shows no errors

---

## 🧪 Quick Test

### Test 1: Degrees Load
1. Click "Choose College"
2. Should see list of degrees
3. If blank → Check database.json

### Test 2: Subjects Load
1. Select a degree
2. Select "Cutoff / Counselling"
3. Should see subject input fields
4. If blank → Check subjects in database.json

### Test 3: Exams Load
1. Select a degree
2. Select "Entrance Exam"
3. Should see exam dropdown
4. If blank → Check entrance_exams in database.json

### Test 4: Colleges Show
1. Complete any admission type
2. Should see colleges list
3. If blank → Check colleges in database.json

---

## 📝 Sample Valid Data

```json
{
  "degrees": ["Engineering", "Medical"],
  "subjects": {
    "Engineering": ["Mathematics", "Physics", "Chemistry"],
    "Medical": ["Biology", "Physics", "Chemistry"]
  },
  "cutoff_formula": {
    "Engineering": "marks.Mathematics + marks.Physics + marks.Chemistry",
    "Medical": "marks.Biology + marks.Physics + marks.Chemistry"
  },
  "entrance_exams": ["NEET", "JEE Main"],
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
        "college_name": "Madras Medical College",
        "degree": "Medical",
        "location": "Chennai",
        "exam_required": "NEET",
        "score_range": "600-720"
      }
    ],
    "management": [
      {
        "college_name": "SRM College",
        "degree": "Engineering",
        "location": "Chennai",
        "fee_range": "150000-200000"
      }
    ]
  },
  "management_colleges": []
}
```

---

## 🆘 Still Having Issues?

### Check These Files
1. `QUICK_REFERENCE.md` - Quick guide
2. `QUICK_START.md` - Getting started
3. `DATA_IMPORT_TEMPLATE.md` - Data templates
4. `COLLEGE_SYSTEM_README.md` - Full docs

### Browser Console Errors
- Copy the error message
- Search in documentation
- Check JSONLint for JSON errors

### File Path Issues
- Verify all files exist
- Check folder structure
- Ensure no typos in file names

---

## 💡 Pro Tips

1. **Always validate JSON** - Use JSONLint.com
2. **Use sample data first** - Test before adding your data
3. **Check console errors** - F12 → Console tab
4. **Hard refresh** - Ctrl+F5 (not just F5)
5. **Test one thing at a time** - Add degrees first, then colleges

---

## 🎯 Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Blank page | Hard refresh (Ctrl+F5) |
| No degrees | Copy sample data to database.json |
| No subjects | Add subjects to database.json |
| No exams | Add entrance_exams to database.json |
| No colleges | Add colleges to database.json |
| JSON error | Validate at JSONLint.com |
| Path error | Check file locations |
| Calculation error | Check formula syntax |

---

**Need more help? Check the documentation files!** 📚
