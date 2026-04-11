# RTL Logical Properties Violations — 2026-04-11

## Context

CLAUDE.md "Design — Non-Negotiable Rules" states:

> RTL everywhere — logical properties only (ms/me/ps/pe, not ml/mr)

A grep across `apps/mobile/**/*.tsx` for `marginLeft|marginRight|paddingLeft|paddingRight` surfaced **26 violations across 12 files**. In an RTL-only Hebrew app these physical directional properties produce mirrored spacing bugs whenever the layout flips — padding that should hug the start edge ends up hugging the end edge.

This document preserves the findings for a future cleanup phase. It is **not** part of Phase 0 — Phase 0 is cleanup-only, no behavior changes. Fixing these requires visual regression verification on every affected screen.

## Fix pattern

| Physical (wrong) | Logical (correct) |
| ---------------- | ----------------- |
| `marginLeft`     | `marginStart`     |
| `marginRight`    | `marginEnd`       |
| `paddingLeft`    | `paddingStart`    |
| `paddingRight`   | `paddingEnd`      |

React Native supports all four logical property names natively on all platforms.

## Violations

All paths relative to `apps/mobile/`.

### components/checklist/

**CheckItem.tsx** — 2 violations

- L79 `paddingLeft: 16`
- L80 `paddingRight: isChild ? 32 : 16`
- Context: container padding for checklist row; child indent uses `paddingRight` asymmetrically.

**RoomAccordion.tsx** — 2 violations

- L123 `paddingLeft: 12`
- L124 `paddingRight: 12`
- Context: symmetric padding — logically safe but still violates the rule; should be `paddingHorizontal: 12`.

### components/home/

**ProjectsSection.tsx** — 1 violation

- L89 `marginLeft: 6`
- Context: icon spacing inside horizontal list row.

**ReportsSection.tsx** — 2 violations

- L87 `marginLeft: 6`
- L171 `marginRight: 8`
- Context: icon spacing in report row summary.

**ToolGrid.tsx** — 1 violation

- L113 `paddingRight: 2`
- Context: fine-tune padding on tool grid item.

### components/projects/

**ApartmentRow.tsx** — 2 violations

- L111 `marginLeft: 8`
- L218 `marginRight: 8`
- Context: floor badge and action button spacing.

**BuildingCard.tsx** — 2 violations

- L116 `marginLeft: 10`
- L185 `marginLeft: 8`
- Context: card footer icon spacing.

### components/reports/

**StatusBadge.tsx** — 2 violations

- L192 `marginLeft: 8`
- L211 `style={{ marginRight: 8 }}`
- Context: status pill icon spacing.

### components/wizard/

**StepApartment.tsx** — 4 violations

- L131 `style={{ marginLeft: 10 }}`
- L203 `paddingRight: 4`
- L320 `marginLeft: 10`
- L341 `marginRight: 6`
- Context: apartment grid cell layout + inline icon spacing.

**StepProject.tsx** — 3 violations

- L86 `style={{ marginLeft: 10 }}`
- L139 `style={{ marginLeft: 8 }}`
- L212 `style={{ marginLeft: 10 }}`
- Context: project row icons and action affordances.

**StepProtocol.tsx** — 3 violations

- L114 `marginLeft: 12`
- L137 `marginLeft: 12`
- L232 `marginLeft: 10`
- Context: protocol option row icons.

**StepReportType.tsx** — 2 violations

- L100 `marginLeft: 12`
- L123 `marginLeft: 12`
- Context: report type selector icon spacing.

## Total

- **Files affected:** 12
- **Total violations:** 26
- **Categories affected:** 5 (`checklist`, `home`, `projects`, `reports`, `wizard`)

## Recommended phase

Not Phase 0. Suggested for a dedicated RTL cleanup phase after Phase 1 core functionality stabilizes, so visual regression can be verified against a known-good baseline.
