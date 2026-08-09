# Data Architecture — FormFix

## Exam Requirement Data Schema

All exam/application requirements are stored in `src/data/presets.json` and follow this schema:

```json
{
  "presets": [
    {
      "id": "ssc-cgl-photo",
      "exam": "SSC CGL",
      "organization": "Staff Selection Commission",
      "type": "photo",
      "displayName": "SSC CGL Photo",
      "description": "Photo requirements for SSC CGL application",
      "requirements": {
        "format": ["jpg", "jpeg"],
        "dimensions": {
          "width": null,
          "height": null,
          "minWidth": null,
          "minHeight": null,
          "maxWidth": null,
          "maxHeight": null,
          "aspectRatio": null
        },
        "fileSize": {
          "min": null,
          "max": null,
          "unit": "KB"
        }
      },
      "guidelines": [
        "Recent colored passport-size photograph",
        "Plain white background",
        "Face should cover 70-80% of the photograph"
      ],
      "source": {
        "url": "https://ssc.gov.in",
        "document": "SSC CGL 2026 Notice of Examination",
        "verifiedDate": "2026-08-09",
        "notificationYear": "2026",
        "status": "needs-verification"
      },
      "notes": "SSC CGL 2026 uses live photo capture for the primary photograph. Signature still requires upload.",
      "slug": "ssc-photo-resizer",
      "relatedPresets": ["ssc-cgl-signature"]
    }
  ]
}
```

## Schema Field Definitions

### Identification
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✓ | Unique identifier: `{exam-slug}-{type}` |
| `exam` | string | ✓ | Human-readable exam name |
| `organization` | string | ✓ | Conducting body |
| `type` | enum | ✓ | `photo`, `signature`, `thumb-impression`, `declaration` |
| `displayName` | string | ✓ | UI display name |
| `description` | string | ✓ | Brief description for SEO |

### Requirements
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `format` | string[] | ✓ | Accepted formats: `["jpg", "jpeg"]`, `["png"]`, etc. |
| `dimensions.width` | number\|null | | Exact width in pixels (null = no constraint) |
| `dimensions.height` | number\|null | | Exact height in pixels |
| `dimensions.minWidth` | number\|null | | Minimum width |
| `dimensions.minHeight` | number\|null | | Minimum height |
| `dimensions.maxWidth` | number\|null | | Maximum width |
| `dimensions.maxHeight` | number\|null | | Maximum height |
| `dimensions.aspectRatio` | string\|null | | e.g., `"200:230"`, `"1:1"` |
| `fileSize.min` | number\|null | | Minimum file size |
| `fileSize.max` | number\|null | | Maximum file size |
| `fileSize.unit` | enum | ✓ | `"KB"` or `"MB"` |

### Source Tracking
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source.url` | string | ✓ | Official source URL |
| `source.document` | string | ✓ | Document name (notification, bulletin) |
| `source.verifiedDate` | string | ✓ | ISO 8601 date of last verification |
| `source.notificationYear` | string | ✓ | Notification/exam year |
| `source.status` | enum | ✓ | `"verified"`, `"needs-verification"`, `"outdated"` |

### Metadata
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `guidelines` | string[] | | Official guidelines as bullet points |
| `notes` | string\|null | | Important notes (e.g., live capture info) |
| `slug` | string | ✓ | URL slug for SEO page |
| `relatedPresets` | string[] | | IDs of related presets for internal linking |

## Validation Rules

1. `id` must be unique across all presets
2. `format` must contain at least one value
3. At least one of `dimensions` or `fileSize` must have non-null values
4. `source.verifiedDate` must be a valid ISO 8601 date
5. `source.status` must be one of the three allowed values
6. `slug` must be URL-safe (lowercase, hyphens only)
7. Presets with `status: "needs-verification"` must display a disclaimer

## Compression Targets Schema

For programmatic compression pages:

```json
{
  "compressionTargets": [
    {
      "targetKB": 20,
      "slug": "compress-image-to-20kb",
      "title": "Compress Image to 20 KB",
      "description": "Compress your image to ≤ 20 KB for exam applications",
      "commonUses": ["SSC signature", "IBPS signature"],
      "searchDemand": "verified"
    }
  ]
}
```

## Data Versioning

- All preset data includes `source.verifiedDate`
- When requirements change, update the verification date
- Old requirements are not deleted — they get `status: "outdated"`
- Build-time validation ensures no `"outdated"` presets are published

## Update Process

1. Official notification released by exam body
2. Read notification and extract requirements
3. Update preset in `presets.json`
4. Set `source.verifiedDate` to today
5. Set `source.status` to `"verified"`
6. Update `DATA_SOURCES.md` with new source entry
7. Rebuild and deploy

## Organization

Presets are organized by exam body, then by exam, then by document type:

```
SSC
├── CGL → photo, signature
├── CHSL → photo, signature
└── GD → photo, signature

UPSC
└── CSE → photo, signature (triple)

NTA
├── NEET UG → photo, signature, thumb impression
└── JEE Main → photo, signature

IBPS
├── PO → photo, signature, thumb, declaration
├── Clerk → photo, signature, thumb, declaration
└── SO → photo, signature, thumb, declaration

RRB
└── General → photo, signature
```
