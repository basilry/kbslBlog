---
title: "In an age of AI-generated code, I want to teach developers how to ship"
slug: building-an-ai-fullstack-course
description: "I am building an Inflearn course with the working title 'Shipping a Production Full-Stack App with AI Agents.' Why I want to teach the process from requirements to verification, testing, deployment, and operations, and where the work stands."
publishedAt: "2026-09-08"
updatedAt: "2026-09-09"
category: development
tags:
  - AI
  - Inflearn
  - Online courses
  - Full-stack
  - Side projects
  - Developer education
draft: false
thumbnail: /content/building-an-ai-fullstack-course/preparing-course.webp
---

I am creating a course for Inflearn called **“Shipping a Production Full-Stack App with AI Agents.”** I want to cover how to define the scope of an idea, verify what you implement with AI, and deploy it as a working service.

I have substantially revised the curriculum twice and drafted the slides and script for the first lesson. I have also defined the practice service and the output for each lesson. Next, I need to build the completed reference repository that students can run and consult.

This post explains why I started making the course, what I intend to teach, and the current progress. I wrote about why I began considering articles and courses as income sources in [my previous post](/post/ai-progress-and-my-next-income).

<figure>
<img src="/content/building-an-ai-fullstack-course/preparing-course.webp" alt="A workspace for preparing online course materials while reviewing the practice service" width="1536" height="1024" loading="lazy">
<figcaption>Preparing the practice service, lesson materials, and recording setup together. AI-generated illustration.</figcaption>
</figure>

## There is still work to do after the code is generated

AI coding tools can help you build screens and APIs quickly. But as features accumulate, you need to check that each part follows the same rules.

A screen might show success while the API returns a failure, or the database might store duplicate records. Code that ran locally may stop in production because of environment-variable settings. Even if AI says the task is finished, it is difficult to know whether the result is usable without testing the main user actions.

I saw similar problems while teaching full-stack development and mentoring bootcamp projects. Some students knew how to use React and APIs, but their projects stalled because they had not decided which features belonged in the current version, how the frontend and backend would exchange data, or what had to pass before deployment.

More AI-generated code also means more to review. Someone needs to decide which changes to accept and which need fixing. In this course, I want to teach **how to complete and deploy a service with AI**.

## For developers who have not made it through deployment alone

I am thinking of people who have learned the basics of React or APIs and managed code with Git, but whose projects have remained CRUD demos or local applications.

I hope it will help bootcamp graduates and developers with one to three years of experience who want an operable service in their portfolio, as well as people who can build features with AI but struggle to manage structure and quality. That is why I intend to cover the order of work required to complete a service and the criteria for finishing each stage.

The goal is for students to finish with a public service URL and a runnable repository. I am also designing the course to produce requirements, API and data specifications, automated test results, failure records, deployment steps, and an operations guide.

## The practice project is SignalDesk

The practice service has the working name `SignalDesk`. It is a web service that gathers public data or synthetic event data included in the course and creates briefings by topic.

While building its list and detail screens, I plan to add duplicate-data prevention and validation that AI responses follow the expected format. It will detect truncated or delayed responses and record which model and prompt were used.

I am designing the core exercises to run without external API keys. There will be a mock mode using synthetic data and prepared AI responses, with real AI API integration as an optional exercise.

Alongside valid input, I intend to include duplicate records, invalid dates, AI responses with missing fields, and timeout cases in the test data. The aim is to let students deliberately trigger errors, handle them, and practice finding their causes.

I have organized the curriculum into eight stages.

1. Define the features to implement and deploy in a one-page scope document.
2. Write repository rules, restrictions, and completion criteria for AI to follow.
3. Define data formats and processing rules across the interface, API, database, and AI features.
4. Implement a minimal user journey from the list to a detail page.
5. Add failure detection and recovery through AI response validation, execution history, retries, and duplicate prevention.
6. Verify AI-generated changes with unit, integration, and E2E tests and code review.
7. Separate development and production environments, deploy, and document logging, costs, rollback, and incident procedures.
8. Prepare the public URL and test results so they can be explained in a portfolio.

<figure>
<img src="/content/building-an-ai-fullstack-course/testing-and-deploying.webp" alt="Checking a web service with test results and a mobile screen" width="1536" height="1024" loading="lazy">
<figcaption>Checking test results and service behavior across different screens. AI-generated illustration.</figcaption>
</figure>

## Showing how to judge AI's output

If I explain only a tool's buttons and commands, the course will quickly become outdated as the product changes. I want to show the process of setting goals and verifying results repeatedly throughout the lessons.

First, a person defines the goal, constraints, and completion criteria. AI is told what it may read and what it must not change. When it produces a design or code change, we inspect the changes and their reasoning, then assess the results through tests and actual execution. If they fail the criteria, we find the cause and revise them. If they pass, we record the decision and verification results before moving on.

I intend to keep footage of code generation brief while explaining how I identified bad proposals, why tests failed, and why I reduced a feature's scope. I also want to show the process of checking the deployed interface. The purpose is to help students verify results in the same way on their own projects.

## Building the finished service before organizing the lessons

Initially, I planned to settle the curriculum and record the lessons in order. Now I want to develop and deploy the completed `SignalDesk` first. I will collect the documents, tests, failures, and recovery procedures needed along the way, then decide the lesson sequence.

If I record the course first, later structural changes could force me to reshoot earlier lessons. I might also end up teaching procedures that the actual development process does not need. I want to complete the full process myself and check that students can follow it.

To support that, I am preparing a starter repository, outputs for each stage, test data that reproduces errors, and testing and deployment procedures.

## Deciding the scope and practice materials

There are many possible topics: login, payments, RAG, vector search, multiple agents, Docker, and more. Including everything would make the course harder to finish and increase the amount students need to implement. For the first course, I decided to prioritize the main user journey, AI response validation, testing, and deployment.

I also need to choose the AI tool for recording. I plan to begin with a single tool I know well and use it consistently throughout the practice environment.

The course code and data need to be created from scratch. I need examples that reproduce real development errors without using company repositories, client data, or internal documents. I want anyone to be able to download them and run them under the same conditions.

## Current progress and the next task

I have defined the audience and learning goals and written curriculum v0.2 with eight main sections. I have also drafted the slides and script for the first lesson, “The problem this course solves.” The scope of `SignalDesk`, student missions, final deliverables, and self-assessment criteria are documented.

Next is the completed repository. I plan to implement the list and detail screens, test truncated and delayed AI responses, and verify the deployment. After that, I intend to record a pilot lesson explaining the finished interface, project details, and failure recovery.

Now that I have shared the production plan, I want to show actual results too. To help students deploy their own services after following the course, I need to finish that process myself first. I hope the next development update can describe specific features I have implemented and verified in `SignalDesk`.
