# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the Aether AI project.

## What is an ADR?

An Architecture Decision Record documents a significant architectural decision, including the context that prompted it, the decision itself, the alternatives considered, and the consequences of the choice. ADRs provide a permanent record of why the project is built the way it is.

## Why ADRs?

Architectural decisions are often implicit or lost over time. ADRs make them explicit, reviewable, and searchable. New team members can understand past decisions without oral history. Future refactors can evaluate whether the original context still holds.

## Naming Convention

```
NNNN-title-with-hyphens.md
```

- `NNNN` — four-digit zero-padded sequence number (0001, 0002, ...)
- `title-with-hyphens` — short, descriptive kebab-case title

## Numbering Convention

ADR numbers are sequential and never reused. When a decision is superseded, a new ADR is created and the old one is marked as superseded in its header.

## Template

```markdown
# NNNN — Title

**Status:** Proposed | Accepted | Superseded by NNNN

**Date:** YYYY-MM-DD

## Context

What is the problem or motivation that led to this decision?

## Decision

What was chosen and why?

## Alternatives Considered

What other options were evaluated and why were they rejected?

## Consequences

What trade-offs, benefits, or risks result from this decision?

## Future Work

What follow-up items or open questions remain?
```
