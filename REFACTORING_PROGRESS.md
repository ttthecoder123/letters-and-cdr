# Code Structure Optimization - Refactoring Progress

## Overview
Refactoring the Legal Letter Generation System from 3 monolithic HTML files (7,605 lines, 304KB) into a modular architecture with separate CSS and JavaScript files.

## Goal
Minimize AI coding token usage for future development by breaking down the codebase into logical, feature-specific modules.

## Progress Status

### ✅ Phase 1: Shared Infrastructure (COMPLETE)
- [x] Created `js/0-config.js` - All configuration (webhooks, APIs, firm details, solicitor mappings, court lists, storage keys)
- [x] Created `js/0-shared-utils.js` - Common utility functions (formatDate, name conversion, validation, clipboard)
- [x] Created `js/0-storage.js` - localStorage wrapper for data persistence
- [x] Created `js/0-integrations.js` - Zapier and Supabase integrations
- [x] Created `css/0-shared.css` - Shared styles (~400 lines)
- [x] Updated `index.html` to reference shared files
- [x] Committed to git

### ✅ Phase 2: CSS Extraction (COMPLETE)
- [x] Created `css/1-master-client-list.css` - Master Client List styles (~200 lines)
- [x] Created `css/2-letter-generator.css` - Letter Generator styles (~50 lines)
- [x] Created `css/3-cdr.css` - CDR styles (minimal, uses shared)
- [x] Created `css/4-court-calendar.css` - Court Calendar styles (~250 lines)
- [x] Created `css/5-analytics.css` - Analytics styles (placeholder)
- [x] Created `css/6-file-note.css` - File Note styles (placeholder)
- [x] Created `css/7-subpoena.css` - Subpoena styles (placeholder for Phase 4)
- [x] Created `css/8-task-priority.css` - Task Priority styles (placeholder for Phase 5)
- [x] Created `css/9-mobile.css` - Mobile responsive styles (~900 lines)
- [x] Updated `index.html` to reference all CSS files
- [x] Committed to git

### 🔄 Phase 3: JavaScript Extraction (IN PROGRESS)
Total JavaScript to extract: ~3,255 lines

#### Completed:
- [x] Created `js/1-master-client-list.js` - Master Client List module (~200 lines)
  - Client table rendering (desktop & mobile)
  - Client selection dropdowns
  - Modal management
  - Client management (add, select)
  - Mobile card toggle

#### Remaining:
- [ ] Create `js/2-letter-generator.js` - Letter Generator module (~800 lines)
  - loadClientInfo()
  - updateLetterFields()
  - generatePrompt()
  - Letter type-specific prompt generators (CCL, Mention, Final, FeeReestimate)
  - copyPrompt(), clearForm(), updateExcelRecord()
  
- [ ] Create `js/3-cdr.js` - CDR module (~300 lines)
  - loadCDRClientInfo()
  - getAllocatedTo(), getLetterAllocatedTo()
  - formatCDRText(), formatCDRHTML()
  - generateCDR()
  - sendCDRToZapier()
  - clearCDRForm()
  
- [ ] Create `js/4-court-calendar.js` - Court Calendar module (~200 lines)
  - updateCourtCalendar()
  - navigateWeek()
  - renderWeekView()
  - Calendar data processing
  
- [ ] Create `js/5-analytics.js` - Analytics module (~100 lines)
  - updateAnalytics()
  - Statistics calculation
  - Chart rendering
  
- [ ] Create `js/6-file-note.js` - File Note module (~500 lines)
  - loadFileNoteClientInfo()
  - generateFileNotePrompt()
  - File note type-specific generators (General, Court, Email)
  - Time unit calculations
  
- [ ] Create `js/7-excel-functions.js` - Excel Functions module (~200 lines)
  - loadExcelFile()
  - exportToExcel()
  - Excel data parsing and formatting
  
- [ ] Create `js/8-letter-field-generators.js` - Letter Field Generators module (~800 lines)
  - getCCLFields()
  - getMentionFields()
  - getFinalFields()
  - getFeeReestimateFields()
  - Toggle functions (legal aid, plea options, etc.)
  
- [ ] Create `js/9-app-init.js` - App Initialization module (~100 lines)
  - DOMContentLoaded handler
  - Initial data loading
  - UI initialization
  - Mobile menu functions
  - Navigation functions (switchTab, etc.)
  
- [ ] Update `index.html` to reference all JavaScript modules
- [ ] Remove inline JavaScript from `index.html`
- [ ] Test all functionality
- [ ] Commit to git

### ⏳ Phase 4: Integrate Subpoena as Tab (PENDING)
- [ ] Extract subpoena.html functionality
- [ ] Create subpoena tab in main application
- [ ] Integrate subpoena form and logic
- [ ] Update navigation
- [ ] Test subpoena functionality
- [ ] Commit to git

### ⏳ Phase 5: Integrate Task Priority as Tab (PENDING)
- [ ] Extract task-priority.html functionality
- [ ] Create task priority tab in main application
- [ ] Integrate task priority form and logic
- [ ] Update navigation
- [ ] Test task priority functionality
- [ ] Commit to git

### ⏳ Phase 6: Final Testing and Cleanup (PENDING)
- [ ] Test all features end-to-end
- [ ] Verify all webhooks and APIs work
- [ ] Test mobile responsiveness
- [ ] Clean up any remaining inline code
- [ ] Update documentation
- [ ] Final commit
- [ ] Create pull request

## Expected Results
- **Before:** 7,605 lines, 304KB, 15,000-30,000 tokens per task
- **After:** ~4,200 lines, 70-90% token savings per task
- **Modular Structure:** 13 JS files + 9 CSS files + 1 HTML file

## Critical Constraints
- ✅ All webhooks, APIs, and authentication must remain intact
- ✅ Everything must operate exactly as it does now (zero functional changes)
- ✅ Subpoena and Task Priority integrated as tabs (Option A)

## Current Status
Phase 3 in progress - extracting JavaScript modules. Master Client List module complete. Continuing with Letter Generator, CDR, Court Calendar, Analytics, File Note, Excel Functions, Letter Field Generators, and App Initialization modules.
