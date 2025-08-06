---
title: AI assisted workflow for Django query optimizations
path: /ai-query-optimizations
date: 2025-08-03
summary: Combining Copilot, Postgres MCP Server, Django-Silk and Playwright for AI assisted query optimizations
tags: ['Copilot', 'Django', 'Django-silk', 'Playwright', 'AI', 'LLMs']
---

![Copilot workflow](./images/copilot-screenshot.jpeg)

## Introduction

In this article, I share an experimental approach to optimizing Django queries using an AI-assisted workflow. By combining [VSCode Copilot](https://code.visualstudio.com/docs/copilot/overview), Postgres [MCP server](https://code.visualstudio.com/docs/copilot/chat/mcp-servers), [django-silk](https://github.com/jazzband/django-silk) and [Playwright](https://playwright.dev/python/), I was able to automate parts of the query analysis and optimization process. The results were promising, though the workflow had some notable limitations.

## Problem

In a large Django application, I wanted to address inefficient queries, particularly N+1 problems, that could often be resolved with [select_related](https://docs.djangoproject.com/en/5.2/ref/models/querysets/#select-related) or [prefetch_related](https://docs.djangoproject.com/en/5.2/ref/models/querysets/#prefetch-related). Given the size of the codebase, I explored whether an AI coding agent could help speed up the process.

Two main obstacles emerged:

1. The AI needed a way to measure the number of queries executed
2. The AI needed a way to send authenticated requests to the application

## Solution

[Django-silk](https://github.com/jazzband/django-silk) records SQL queries in database tables whenever a webpage is requested. This makes it straightforward to spot N+1 issues through duplicate queries and to trace them back to the source code. Silk provides a web interface for manual analysis, but since the data is stored in Postgres, it can also be accessed programmatically.

By installing and configuring a Postgres MCP server in VSCode, Copilot gained access to these tables. This enabled the AI to analyze query performance directly from my local database, solving the first challenge of query measurement.

To configure a Postgres MCP server add the following to `~/.vscode/mcp.json` using your actual database url:
```json
{
    "servers": {
        "postgres": {
            "command": "npx",
            "args": [
                "-y",
                "@modelcontextprotocol/server-postgres",
                "postgresql://user:pass@localhost:5432/mydb"
            ]
        }
    }
}
```
Then open the command palette and run "MCP: List servers", then select "postgres", then select "Start server". If the connection to your database is successful the output should say "Discovered 1 tools".

For the second challenge, I used [Playwright](https://playwright.dev/python/) to automate browser interactions. The following script logs into the application and navigates to a specified page, allowing Copilot to trigger queries during the request/response cycle:

```python
# request_page.py

import sys

from playwright.sync_api import sync_playwright

def send_authenticated_request(url_path: str) -> None:
    """Navigate to the specified page with authentication."""
    base_url = "<http://localhost:8001>"
    full_url = f"{base_url}{url_path}"

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()

        page.goto(f"{base_url}/login/")
        page.wait_for_selector('input[name="username"]', timeout=10000)
        page.fill('input[name="username"]', "mitch.harle")
        page.click('button[type="submit"]')
        page.fill('input[name="password"]', "*******")
        page.click('button[type="submit"]')
        page.wait_for_url(f"{base_url}/", timeout=10000)

        page.goto(full_url)
        page.wait_for_url(full_url, timeout=10000)

if _name_ == "_main_":
    send_authenticated_request(sys.argv[1])
```

The following prompt can then be used to start the process in Copilot:

> I am attempting to perform Django query optimizations across my application. When I ask you to optimize queries on the url `/abc/` you should call the following script: `python3 request_page.py /abc/`

> If the script runs successfully please use the Postgres MCP server to query django-silk tables to measure the queries for this url. You should identify if there are any N+1 queries, this is usually identified by many duplicate queries. The 'SQLQuery' table has a field 'traceback' which will give you the code which executed the SQL query, use this to find where in the code query optimizations can be made. For now I am mostly focusing on fixing very inefficient queries, for example those that can be fixed with `select_related`/`prefetch_related`.

> You should attempt to fix the code, then request the url again, then measure the queries again. If your code changes has reduced the number of queries keep the change, if not rollback the change and try a different approach.

> Let's start with url `/abc/`

Copilot then performed the following iterative loop:

1. Send an authenticated request to the target page
2. Analyze query execution data from Django-Silk
3. Modify the code to reduce queries

![Copilot workflow](./images/query-optimization-cycle.png)

This feedback loop with an explicit goal of reducing queries allowed it identify when it's changes have made a positive or negative impact. With some human oversight, this process successfully identified and resolved several inefficient queries.

## Limitations

The limitations of this approach included:

1. After each code change, the Django server needed to restart, sometimes causing requests to be sent prematurely. The Playwright script could be improved to handle this more reliably.
2. Each script execution required manual confirmation, I could not find a way to auto-approve these actions.
3. The script only supported GET requests. Optimizing queries behind POST requests or JavaScript interactions would require custom Playwright actions.
4. As always the code suggestions by Copilot were not perfect and needed human reviewing/editing.
5. At times, Copilot forgot how to call scripts and needed reminders.

## Conclusion

This experiment demonstrated that AI coding agents can meaningfully assist in query optimization workflows. While not fully autonomous, the combination of Copilot, Django-Silk, Postgres MCP server, and Playwright provided a practical, partially automated solution for identifying and resolving inefficient queries.

Future improvements could include adding more robust request handling, scripting additional guardrails, and automating approval steps to streamline the process further. Despite its limitations, setting up this workflow was quick and delivered tangible benefits, highlighting the evolving capabilities of AI-assisted development tools.
