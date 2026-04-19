# Ambulance Status Messages Fix - TODO

## Approved Plan Summary
Add dynamic status messages for ambulance dispatch in control.html/map.js:
- Dispatch: "on the way"
- Reached emergency: "on hospital way" 
- Reached hospital: "successful"

## Steps:
- [x] Step 1: Add state tracking (reportStatus Map, dispatchedReportId) in initControl()
- [x] Step 2: Update ambulance dispatch click handler to set 'on-the-way' status and re-render
- [x] Step 3: Update onAmbulanceReachedEmergency() to set 'to-hospital' status and re-render
- [x] Step 4: Update frame() completion logic for return-home to clear status (if needed)
- [x] Step 5: Modify renderReports() to display status labels based on reportStatus.get(id)
- [ ] Step 6: Test and attempt_completion

Current: All edits complete - ready for test/demo






