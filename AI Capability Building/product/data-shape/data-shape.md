# Data Shape

## Entities

### TeamMember
Represents an individual on the DXD AI Capability Building team. Includes their name, role, bio, and areas of expertise — used on the About the Team section and referenced across projects.

### Project
An AI initiative or capability-building effort led or supported by the team. Has a title, description, status, timeline, and associated outcomes or learnings.

### Resource
A learning or reference asset — such as a guide, tool, framework, article, or training link — curated by the team for internal use and capability building.

### Update
A news item or announcement from the team, such as a milestone reached, a new initiative launched, or a notable outcome. Represents a point-in-time communication to stakeholders and team members.

### Tag
A label used to categorize and filter Projects, Resources, and Updates by topic area (e.g., "Generative AI", "Prompt Engineering", "Automation").

## Relationships

- TeamMember is associated with one or more Projects
- Project has many Updates
- Resource has many Tags
- Project has many Tags
- Update can reference a Project
