# Application Shell Specification

## Overview
The DXD AI Capability Centre uses a top navigation layout — a clean, website-style header that sits above the content area. This pattern suits a stakeholder-facing hub where the audience browses between sections rather than working intensively within one.

## Navigation Structure
- **About the Team** → /about
- **Projects & Initiatives** → /projects
- **Learning Resources** → /resources
- **News & Updates** → /updates

## User Menu
Located in the top-right corner of the header. Displays the user's avatar (initials fallback) and name. Clicking opens a dropdown with a logout option.

## Layout Pattern
Full-width header with the DXD AI Capability Centre logo/wordmark on the left, navigation links centered or right-aligned, and the user menu at the far right. Content renders in a max-width container below the header.

## Responsive Behavior
- **Desktop:** Full horizontal nav with all links visible and the user menu on the right
- **Tablet:** Same as desktop, links may compress slightly
- **Mobile:** Logo on the left, hamburger menu icon on the right. Tapping the hamburger reveals a full-width dropdown with all nav links stacked vertically.

## Design Notes
- Active nav item is highlighted with the primary blue color and an underline indicator
- Hover states use the sky (secondary) color for subtle feedback
- Header has a bottom border using slate to separate it from page content
- Nav links use Inter font, medium weight
- The shell does not include authentication UI — just navigation chrome
