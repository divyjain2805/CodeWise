function explainprompt(problem, code, language) {
    return `
You are a Senior Software Engineer.

Analyze the following solution.

Problem Title:
${problem.title}

Problem Description:
${problem.description}

Programming Language:
${language}

User Code:
${code}

Return your answer in Markdown.

Include these sections:

## Explanation

## Time Complexity

## Space Complexity

## Strengths

## Weaknesses

## Suggestions

Rules:

- Do not rewrite the entire solution.
- Do not provide a completely different approach.
- Keep the explanation beginner-friendly.
- Keep the response under 350 words.
`;
}

module.exports = explainprompt;