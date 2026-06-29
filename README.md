# Topside AI OS

A self-contained action control center assembled from the supplied Topside control center, AI OS dashboards, skill packages, audit data, and task concepts.

## Run

Open `index.html` in a modern browser. No build step or server is required.

## What Works

- Every workflow badge opens an actionable job panel.
- Each job declares required inputs and required outputs.
- **Launch in Claude** copies a complete task packet and opens Claude.
- **Copy task** copies the job packet without leaving the control center.
- **Download task** creates a portable `.txt` task file.
- **Open tool** launches the correct bundled dashboard, analyzer, data source, or external business application.
- Search and workspace navigation work across all 27 actions.

## Included Assets

- `dashboards/`: preserved dashboards and analyzers from the supplied AI OS.
- `source-skills/`: preserved original `.skill` packages.
- `skills/`: callable skill contracts for each control-center level.
- `data/site-audit.json`: supplied Topside site audit/configuration data.

External systems such as QuickBooks, Leap, Google Ads, and Google Business still require valid user accounts and authorization. The control center prepares and routes the work but does not bypass authentication.
