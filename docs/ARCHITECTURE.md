# Architecture

Status: Stub / not approved  
Date: 2026-05-26  
Creative direction owner: Batu  
Implementation owner: Codex

## Current State

No app architecture is approved yet.

This file exists to prevent implementation drift before code begins. It does not approve React, Vite, PixiJS, a map system, rendering approach, data schema, or module boundaries.

## Future Architecture Gate

Before app implementation, the proposed architecture must define module boundaries and public interfaces.

The agent must state:

- What public interfaces or module boundaries will change.
- What files will be touched.
- What feedback loop will verify the change.
- What decisions remain reserved for Batu.

Public interfaces and module boundaries must be reviewed before implementation.

## Future Separation Targets

Future implementation should separate:

- Map, camera, and viewport behavior.
- Place data and factual source metadata.
- Rendering layer.
- Interaction layer.
- UI cards and markers.
- Visual tokens and assets.

These are intended boundaries to review later, not approved modules or file names.

## Deep-Module Principle

Prefer deep modules with simple public interfaces and hidden internal complexity.

Avoid shallow wrappers, speculative abstractions, broad utility files, and file sprawl. Add abstractions only when they protect a stable boundary, reduce real complexity, or match an approved architecture.

