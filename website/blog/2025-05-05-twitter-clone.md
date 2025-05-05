---
title: Creating a Twitter clone with both Copilot agent mode and Cursor
path: /twitter-clone
date: 2025-05-05
summary: Creating a Twitter Clone from scratch, first with Copilot Agent and then with Cursor
tags: ['Copilot', 'Cursor', 'Python', 'Django', 'HTMX', 'AI', 'LLMs']
---

![Cursor vs. Copilot](./images/cursor-vs-copilot.png)

## Introduction

In early 2025, we saw a surge in popularity of "vibe coding" tools. Platforms like [Cursor](https://www.cursor.com/) and [Windsruf](https://windsurf.com/editor), both based on VSCode, sparked a lot of buzz. These tools go beyond the auto-complete features seen in [Copliot](https://code.visualstudio.com/docs/copilot/overview). They integrate agent-like AIs that can not only auto-complete but plan and implement code changes across multiple files based on simple, natural language instructions. This shift led many developers to adopt Cursor or Windsurf as their primary IDEs. In response, Microsoft released [Copilot agent mode](https://code.visualstudio.com/docs/copilot/chat/chat-agent-mode) on April 3rd, 2025. At that point, I hadn’t spent much time with “vibe coding” tools myself, so I decided to dive in and compare Copilot's agent mode with Cursor by building a Twitter clone from scratch using both tools.

## Copilot

I started with Copilot by providing a fairly detailed initial prompt, to create a Twitter clone using Django, docker compose and Postgres, with the ability to follow other users by username, post/like/reshare tweets and a tweet feed. It started doing it's thing, generating the Django boilerplate code asking for confirmations along the way (you can set to auto-confirm if you want). It produced some sensible database models, but the views were function-based, so I asked to convert them to class-based, something I prefer and could set as a generic rule for future prompts.

The problem then came when trying to run the project... lots of configuration issues. Some issues were easy to fix with pre-existing knowledge of Django, other were not as obvious. Feeding the error messages into the chat went round in circles. After some frustration I decided it was actually going to be quicker to start a Django project from scratch using [django-cookiecutter](https://github.com/cookiecutter/cookiecutter-django) which got a running project with Django + Postgres + Docker Compose very quickly. A case where reaching for a deterministic tool was the better option.

Starting from a functional base, I asked Copilot again to generate the Twitter clone. Along the way I had to nudge it in a sensible direction. But then, when trying to run the project, I hit a runtime error. The feeling was very strange, my brain had entered a sort of idle/lazy mode whilst I was waiting for the output, the complete opposite of flow state, I didn't have a gut instinct for what was causing the error message because I hadn't written the code by hand. There was also a strange inertia to putting effort into figuring it out. The path of least resistance was to paste the error message in again, but the attempted solution didn't really solve the issue and effectively hid it by adding a try/except block. After a few more tweaks though... boom! The app was working!

![Twitter clone Copilot](./images/twitter-clone-copilot.png)

This was a true “WOW” moment. The app was well-styled, functional, and featured everything I asked for. The process took around 1.5 hours, whereas doing it by hand would have likely taken me 6-7 hours. A significant time-saver!

## Cursor

Next, I tried the same exercise with Cursor, providing the same initial prompt. Cursor managed to deliver a working Django application in one-shot, something Copilot had failed to do. Not only that, but the resulting application was of better quality, particularly in terms of styling. It had even added the ability to add images to tweets without explicitly asking for it.

![Twitter clone Cursor](./images/twitter-clone-cursor.png)

I decided to spend additional time refining the codebase with Cursor, asking it to add type annotations, logging, mypy, ruff, pre-commit hooks, tests with pytest, and even some Playwright tests. Cursor handled these requests with relative ease.

I also started expanding the feature set—adding Celery and Redis for asynchronous tasks like sending emails when a user's tweet is retweeted, and integrating [HTMX](https://htmx.org/) for interactivity (such as infinite scrolling) instead of relying on vanilla JavaScript. The final result was solid.

The codebase can be found [here](https://github.com/mitch104/twitter-clone). Overall, I was impressed by Cursor, though it wasn't without its hiccups and occasional rabbit holes. I spent around 10 hours on the project, what could have taken me 50/60 hours manually. Interestingly, while both tools used the same underlying model (Claude 3.7), Cursor seemed to make fewer mistakes. I would need to use both tools more thoroughly on different use cases to fully confirm this.

## Conclusion

These AI-powered coding assistants are already proving themselves to be great for prototyping and rapid MVP development, where code quality isn't always the top priority. However, working within large-scale production codebases presents a different set of challenges. Left unchecked, these tools could become automated tech debt generators.

Ultimately, it's a trade-off between speed and code quality. Sometimes, opting for faster development is the right choice; other times, it isn’t. As software engineers, we need to ensure our foundational skills don’t fade away, so we can still troubleshoot and maintain code quality standards.

In the coming months, expect to see best practices evolve for using these tools, hopefully helping to mitigate some of the more glaring mistakes.

As for the race between these coding agents, it seems like Cursor is ahead of the curve, while Microsoft is still catching up with Copilot's agent mode. JetBrains has also entered the arena with a new [coding agent](https://blog.jetbrains.com/blog/2025/04/16/jetbrains-ides-go-ai/) for their IDEs, giving their users a way to incorporate AI into their preferred development environment.
