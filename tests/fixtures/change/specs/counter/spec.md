---
category: spec
title: counter
description: Increment behavior
type: openspec-spec-driven-tdd-spec
---

## Purpose

This capability describes an existing small counter operation, making its externally observable increment behavior testable.

## ADDED Requirements

### Requirement: Increment returns the next integer

The counter MUST return the next integer for an increment call.

#### Scenario: Increment by one

- **WHEN** increment is called with the value 1
- **THEN** the result is 2
