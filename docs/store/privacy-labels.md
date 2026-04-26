# Privacy Labels — Apple & Google Reference

This document is a **reference guide** for filling in privacy labels in **App Store Connect** (Apple Nutrition Label) and **Google Play Console** (Data Safety Form).

⚠️ **MANUAL TASK:** You must enter these in the respective store dashboards. This is not automated.

---

## Apple App Store Connect — Privacy Nutrition Label

### Location

1. Open **App Store Connect**
2. Select **inField** app
3. Go to **Apps** → **Privacy**
4. Scroll to **Data & Privacy**

### Data Collected

#### Data Category: Name

| Field                 | Value                        |
| --------------------- | ---------------------------- |
| **Collected**         | ✓ Yes                        |
| **Linked to User**    | ✓ Yes (required for account) |
| **Used for Tracking** | ✗ No                         |

#### Data Category: Email Address

| Field                 | Value                        |
| --------------------- | ---------------------------- |
| **Collected**         | ✓ Yes                        |
| **Linked to User**    | ✓ Yes (required for account) |
| **Used for Tracking** | ✗ No                         |

#### Data Category: Phone Number

| Field                 | Value                              |
| --------------------- | ---------------------------------- |
| **Collected**         | ⭕ Optional (professional profile) |
| **Linked to User**    | ✓ Yes                              |
| **Used for Tracking** | ✗ No                               |

#### Data Category: Photos or Videos

| Field                 | Value                        |
| --------------------- | ---------------------------- |
| **Collected**         | ✓ Yes                        |
| **Linked to User**    | ✓ Yes (defect documentation) |
| **Used for Tracking** | ✗ No                         |

#### Data Category: Crash Data

| Field                 | Value              |
| --------------------- | ------------------ |
| **Collected**         | ✓ Yes (via Sentry) |
| **Linked to User**    | ✗ No (non-PII)     |
| **Used for Tracking** | ✗ No               |

#### Data Category: Device ID

| Field                 | Value                         |
| --------------------- | ----------------------------- |
| **Collected**         | ✓ Yes (for app functionality) |
| **Linked to User**    | ✗ No                          |
| **Used for Tracking** | ✗ No                          |

### Data Usage

#### Functionality

| Purpose                 | Category                 | Linked | Tracking |
| ----------------------- | ------------------------ | ------ | -------- |
| Account Management      | Name, Email              | Yes    | No       |
| Product Personalization | Phone, Professional Info | Yes    | No       |
| App Functionality       | Photos, Crash Data       | Yes/No | No       |
| Customer Support        | All data                 | Yes    | No       |
| Legal Compliance        | All data                 | Yes    | No       |

#### NOT Included

- ✗ Advertising
- ✗ Marketing
- ✗ Analytics (beyond crash reports)
- ✗ Third-party sharing for advertising
- ✗ Location tracking
- ✗ Health/Fitness data
- ✗ Financial info (except payment for subscription)

### Practices

- **Tracking:** ✗ No
- **Deletion:** ✓ Yes (user can delete account)
- **Encryption:** ✓ Yes (TLS in transit, AES at rest)
- **Third-party sharing:** ✓ Yes (only Supabase, OAuth providers, Sentry — all listed)

---

## Google Play Console — Data Safety Form

### Location

1. Open **Google Play Console**
2. Select **inField** app
3. Go to **Policy** → **App Content**
4. Scroll to **Data Safety**

### Required Questionnaire

#### 1. Collect Personal Data?

**Answer: YES**

### Explain All the Data Types You Collect

#### Data Type: Name

```
Type:      Identity > Name
Shared:    ✗ No
Retention: Active account indefinitely; 30 days after deletion
Ephemeral: ✗ No
Purpose:   Account identification and authentication
```

#### Data Type: Email Address

```
Type:      Identity > Email Address
Shared:    ✗ No (except OAuth providers)
Retention: Active account indefinitely; 30 days after deletion
Ephemeral: ✗ No
Purpose:   Account identification and user communication
```

#### Data Type: Phone Number

```
Type:      Identity > Phone Number
Shared:    ✗ No
Retention: Active account indefinitely; 30 days after deletion
Ephemeral: ✗ No
Purpose:   Professional profile (optional field)
```

#### Data Type: Photos

```
Type:      Photos & Videos
Shared:    ✗ No (stored with reports, private to user)
Retention: Active account indefinitely; 7 years if legal document
Ephemeral: ✗ No
Purpose:   Defect documentation for inspection reports
```

#### Data Type: Crash Data

```
Type:      Diagnostics
Shared:    ✗ No (non-PII, Sentry only)
Retention: 90 days
Ephemeral: ✓ Yes (temporary for crash analysis)
Purpose:   App crash reporting and debugging
```

### Additional Info

#### Encrypt Data in Transit?

**Answer: YES**

- Method: TLS 1.2+
- All communication encrypted

#### Encrypt Data at Rest?

**Answer: YES**

- Method: AES-256
- Provider: Supabase

#### Limited to 3rd Parties?

**Answer: YES**

### Third-Party Sharing (Data Processors)

```
Provider:       Supabase
Purpose:        Database & authentication
Data Shared:    All user data
Policy Link:    https://supabase.com/privacy
```

```
Provider:       Apple (OAuth)
Purpose:        Social sign-in
Data Shared:    Name, email (if user selects)
Policy Link:    https://www.apple.com/privacy/
```

```
Provider:       Google (OAuth)
Purpose:        Social sign-in
Data Shared:    Name, email (if user selects)
Policy Link:    https://policies.google.com/privacy
```

```
Provider:       Sentry
Purpose:        Crash reporting
Data Shared:    Device info, crash logs (non-PII)
Policy Link:    https://sentry.io/privacy/
```

#### User Right to Request Deletion

**Answer: YES**

```
Users can request deletion via:
1. In-app: Settings > Delete Account
2. Email: support@infield.app
Timeline: Complete within 30 days
```

#### User Right to Request Data Export

**Answer: YES**

```
Users can request export via:
1. Email to support@infield.app
Timeline: Within 30 days
Format: JSON, CSV (on request)
```

### Content Rating

| Question              | Answer |
| --------------------- | ------ |
| Contains ads?         | No     |
| Targeted advertising? | No     |
| Sensitive content?    | No     |
| Includes games?       | No     |

---

## Checklist Before Submission

### App Store Connect

- [ ] All data categories filled in correctly
- [ ] "Linked to user" is marked appropriately
- [ ] "Tracking" is only marked for actual tracking (not for us)
- [ ] Third-party sharing list is complete and current
- [ ] Deletion policy is explained
- [ ] Privacy policy link is active and accessible
- [ ] Terms of Service link is active

### Google Play Console

- [ ] Data Safety form completed for all data types
- [ ] Encryption at transit and at rest marked "Yes"
- [ ] Third-party sharing list matches App Store
- [ ] User deletion process documented
- [ ] Data retention periods are realistic
- [ ] No false claims about analytics or tracking

### General

- [ ] Privacy Policy updated to April 2026
- [ ] Terms of Service includes 14-day cancellation (Israel)
- [ ] Support email is monitored (support@infield.app)
- [ ] Both stores show same phone, email, address

---

## Important Notes

1. **No Advertising:** inField does NOT have ads. Ensure "ads" is marked as NO in both stores.

2. **No Tracking:** We do NOT use tracking cookies, analytics pixels, or cross-app tracking. Only crash reporting (Sentry) and essential analytics.

3. **Israel Compliance:** Both stores must acknowledge:
   - Privacy Protection Law Amendment 13 (August 2025)
   - Consumer Protection Law (14-day cancellation window)
   - Account deletion available within app

4. **Regular Audits:** Review these labels quarterly and update if data practices change.

5. **Sentry Optional:** If Sentry is disabled in production, update "Crash Data" to "Not Collected."

---

## FAQ

**Q: What if we add a new data type later?**
A: Update both App Store and Google Play within 7 days. Document the change in git.

**Q: Should we collect location?**
A: No. Defect photos contain metadata; we strip all location data.

**Q: Can we use analytics?**
A: Sentry crash reporting is acceptable. Full analytics (Mixpanel, GA) requires explicit user consent.

**Q: What about payment info?**
A: Apple & Google handle payment. inField never sees card numbers. Mark as "managed by payment processor."

**Q: How long do we keep legal reports?**
A: 7 years per חוק המסמכים העסקיים (Israeli Business Documents Law).
