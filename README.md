# Task Overview

You are working on an admin portal for a SaaS platform where accounts have fields with varying sensitivity depending on the user's role. Previously, sensitive admin-only fields were accessible to all roles in both type definitions and at runtime. Your task is to refactor the data models and service logic to strictly enforce role-based property access using both TypeScript types and runtime schema validation.

# Guidance

- Use TypeScript discriminated unions and mapped types to define clear boundaries between account fields available to each user role.
- Apply Zod schemas to validate incoming and outgoing data at runtime, ensuring only allowed fields for each role are ever surfaced.
- Restrict all data access in the DataService to enforce role permissions both via static typing and runtime validation.
- Ensure that unauthorized fields are never visible in IntelliSense or accessible in JS objects for lower user roles.
- Comprehensive test coverage for type-level and runtime-level account property access per role should be present.

# Objectives

- Redefine the account type system and runtime schemas so that each role's accessible fields are enforced at compile and run time.
- Prevent lower roles from ever having access, either via TypeScript or JavaScript, to sensitive admin-level fields.
- Ensure DataService fetch/update logic only permits and returns role-appropriate properties.
- Add tests that verify both compile-time and runtime correctness of your solution.

# How to Verify

- Run the provided tests to confirm that sensitive admin-only fields are never accessible to viewer or editor roles, either at type level or runtime.
- Confirm that all account data returned from DataService strictly adheres to the role's permissions.
- Attempt to access restricted fields from lower roles and ensure compile-time and runtime protections are in place.
