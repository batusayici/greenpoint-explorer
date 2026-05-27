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

## Future Architecture Guardrail

The eventual architecture must preserve a clear truth/rendering split.

- Greenpoint place facts, addresses, source URLs, verification status, and placement confidence belong in a truth layer / data layer.
- Rendering may consume verified or explicitly labeled place data, but rendering must not own or invent truth.
- UI cards and markers must consume the same truth source as the rendered scene.
- Stylized representation may simplify geometry, scale, and detail, but it must not corrupt address, side-of-street, adjacency, active-status, or location facts.
- The MVP must not depend on live data, scrapers, refresh jobs, or backend services unless a later approved plan explicitly changes that scope.

This is a future guardrail only. It does not approve a database, runtime schema, package, module boundary, public interface, or implementation file.

## Deep-Module Principle

Prefer deep modules with simple public interfaces and hidden internal complexity.

Avoid shallow wrappers, speculative abstractions, broad utility files, and file sprawl. Add abstractions only when they protect a stable boundary, reduce real complexity, or match an approved architecture.
