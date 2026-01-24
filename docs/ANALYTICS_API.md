# Analytics API Documentation

## Overview

This API provides high-level statistics and breakdown metrics for both Candidates and Recruiters to populate their respective dashboards.

---

## 1. Candidate Analytics

**Endpoint:** `GET /analytics/candidate`  
**Auth:** Required (`Bearer <token>`)  
**Role:** `candidate`

### Description

Fetches aggregated statistics for the logged-in candidate, including job search activity and profile visibility.

### Response Body

```json
{
  "total_matches": 12,
  "total_applications": 45,
  "applications_breakdown": [
    {
      "status": "pending",
      "count": 30
    },
    {
      "status": "reviewing",
      "count": 10
    },
    {
      "status": "interview",
      "count": 4
    },
    {
      "status": "rejected",
      "count": 1
    }
  ],
  "swipes_made": 150,
  "profile_views": 85
}
```

### Fields

- **total_matches**: Number of mutual matches with jobs.
- **total_applications**: Total active applications (excluding withdrawn).
- **applications_breakdown**: Array of application counts grouped by status. Useful for Pie Charts or Funnels.
- **swipes_made**: Total number of jobs the candidate has swiped 'Right' on.
- **profile_views**: The number of times a recruiter successfully swiped (left or right) on this candidate's profile.

---
