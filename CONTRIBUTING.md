<h1 style="font-size:4rem; width:100%; text-align:center; margin-bottom: 1rem"}> Contribute</h1>

**General Standards**:

- Use TypeScript for all code.
- Follow the [React Code of Conduct](https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md).
- Use consistent naming conventions (e.g., camelCase for functions and variables).
- Use comments to describe complex implementation details.

**Folder Structure Standards**

- Follow the current folder structure of the project.
- Keep all files related to a specific component in its own folder.
- Reusable components are placed in `components` folder.
- Non reusable components are placed in the related page, pages -> components folder.
- Keep Global styles in the `styles` folder.
- Keep all helper functions in the `helpers` folder
- utility functions in the `utils` folder.
- Keep all React context files in the `context` folder.
- Keep all global state in the `state_management` folder.

**Code Organization Standards**

- Use the same import order for all files:

1. NPM packages
2. Next.js and React imports
3. Internal imports (e.g., components, utils, etc.)

- Use functional React components as much as possible.
- Use React hooks for state management and lifecycle methods.
- Use well-named constants instead of hard-coding values.
- Use `const` and `let` instead of `var` for variable declaration.

**CSS Standards**

- Use CSS Modules to scope styles to specific components.
- Use descriptive class names.
- Use CSS variables for commonly used values such as colors, font sizes, etc.

**Linting Standards**

- Use ESLint to enforce code style standards.
- Use the recommended settings for ESLint with Next.js and TypeScript.
- Fix all ESLint errors and warnings before submitting any pull requests.

# Pull request

**Changes Made**
Brief description of the changes made.

**Related Issues**
List any related issues (e.g., address #15)

**Testing**
Describe how you tested these changes.

**Screenshots (optional)**
If applicable, include screenshots or videos to demonstrate the changes.

**Checklist**

> Format your code with prettier (yarn prettier).

> Make sure your code lints (yarn lint).

- [ ] I have read the CONTRIBUTING.md file.
- [ ] My code follows the code style guidelines.
- [ ] My change requires a change to the documentation.
- [ ] I have updated the documentation accordingly.
- [ ] I have added tests to cover my changes.
- [ ] All new and existing tests passed.

---

# Review Process

Thank you for your contribution to our project! We're committed to making sure that all contributions meet our standards for code quality, performance, security, and user experience. As a small team, we appreciate your patience as we review your submission.

## Expected Timeline

The project is currently only being maintained by @MadsHaerup, so it may take up to 1-2 weeks for us to review your submission. If we anticipate a longer timeline, we'll do our best to let you know in advance.

## Review Criteria

Our review process includes the following criteria:

1. **Code quality**: Does the code follow our coding conventions, best practices, and standards for syntax and organization?

2. **Performance**: Will the changes cause any performance issues or slowdowns for the app?

3. **Security**: Does the code address any potential security vulnerabilities or risks?

4. **User experience**: Will the changes impact the user experience, either positively or negatively?

5. **Testing**: Has the code been thoroughly tested, and do the tests pass?

## Review Feedback

Once we've reviewed your contribution, we'll provide either a merge or a PR response with feedback. If your contribution does not meet our criteria, we'll provide detailed feedback on what needs to be updated or improved. We may request changes, additional information, or clarification to ensure that the contribution meets our standards. We may also discuss potential alternative solutions or suggestions for improvement.

## Maintainer Responsibilities

As maintainers of the project, we are responsible for ensuring that all contributions meet our standards and are merged into the main branch in a timely manner. If we anticipate a longer timeline due to workload or other constraints, we'll do our best to communicate that to you. We're committed to maintaining an open and transparent communication with you throughout the review process.
Thank you for contributing to our project, and we look forward to reviewing your submission!

---

# Code of Conduct

We are committed to providing a productive, inclusive, and welcoming environment for all members of our community. This Code of Conduct outlines our expectations for anyone who participates in our project, as well as the consequences for unacceptable behavior.

## Our Standards

We expect all members of the community to:

- Be respectful and kind to other community members
- Be considerate of other members' backgrounds and experiences
- Refrain from derogatory or discriminatory language or actions
- Use inclusive language and respectfully correct or apologize for mistakes
- Provide constructive feedback and criticism in a respectful manner
- Refrain from personal attacks or harassing behavior

## Unacceptable Behavior

Unacceptable behaviors include, but are not limited to:

- Hate speech or discrimination based on race, gender, sexual orientation, religion, disability, or other personal characteristics
- Threatening or intimidating behavior
- Personal attacks or derogatory comments
- Harassment of any kind, including sexual harassment
- Inappropriate communication or behavior, either online or in person
- Disruptive or disrespectful behavior during community events

## Consequences of Unacceptable Behavior

We take all reports of unacceptable behavior seriously and will investigate and address them appropriately. Consequences for behavior that violates our standards may include warning the offender, asking the offender to leave our project or community, or other appropriate consequences as deemed necessary by the project maintainers.

## Reporting Unacceptable Behavior

If you experience or witness behavior that violates our standards, please report it to the project maintainers by emailing us at [insert email address]. All reports will be kept confidential, and we will do our best to investigate and address the issue as quickly and efficiently as possible.

## Attribution

This Code of Conduct is adapted from the Contributor Covenant, version 2.0, available at https://www.contributor-covenant.org/version/2/0/code_of_conduct.html.
