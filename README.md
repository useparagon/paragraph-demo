<p align="center">
 <a href="https://www.useparagon.com/" target="blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://framerusercontent.com/images/B1sWhCOHmvzGnt3zH0UCcL4ga4Y.png">
    <img alt="Paragon" src="https://raw.githubusercontent.com/useparagon/aws-on-prem/master/assets/paragon-logo-dark.png" width="150">
  </picture>
 </a>
</p>

<p align="center">
  <b>
    The embedded integration platform for developers.
  </b>
</p>

Paragon is an embedded integration platform that 100+ software companies rely on to rapidly accelerate development of native product integrations with 3rd party SaaS apps such as Salesforce, Slack, and QuickBooks. This allows their engineering teams to avoid the heavy costs and risks that come with building and maintaining dozens of their own integrations.

---

## Overview

This repository contains integrations defined in **Paragraph, our integrations-as-code framework**. Paragraph is a TypeScript-based framework that allows you to: 

- Define all your integrations in code and deploy to the Paragon platform for managed authentication, serverless workflows, and monitoring
- Version control all changes to your integrations in Git, adding code review and CI/CD checks to your development process
- Reuse and modularize workflow logic across integrations

Learn more about getting started with Paragraph in [**our documentation**](https://docs.useparagon.com/paragraph/getting-started).

## Usage

**⚠️ Note:** This repository is intended as a demonstrative example only and is _not_ a template that can be built and deployed to your Paragon account.

To get started with Paragraph, install the CLI:

```
npm install -g @useparagon/cli
```

Authenticate with your Paragon account:

```
para auth login
```

And initialize a new project from your dashboard:

```
para init --create-from-existing
```

See [**Getting Started with Paragraph**](https://docs.useparagon.com/paragraph/getting-started) for a guided overview.
