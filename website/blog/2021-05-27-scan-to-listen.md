---
title: How to execute terminal commands with your voice on linux
path: /execute-commands-with-voice
date: 2020-05-27
summary: Proof of concept use of the open source NLP tool 'voice2json' to execute arbitrary commands in a linux terminal
tags: ['Bash', 'Linux', 'AI', 'NLP', 'Open Source']
---

The open source NLP tool [voice2json](http://voice2json.org/) recently caught my eye on [Hacker News](https://news.ycombinator.com/item?id=27235970):
 > voice2json is a collection of command-line tools for offline speech/intent recognition on Linux. It is free, open source (MIT), and supports 17 human languages.

It got me thinking, how hard would it be use this tool to execute terminal commands with just your voice, it turns out... not very!

## Installation

See [docs](http://voice2json.org/install.html) for full details of voice2json installation instructions.

On my first setup attempt I used the [Docker image](http://voice2json.org/install.html#docker-image) however I did encounter [this issue](https://github.com/synesthesiam/voice2json/issues/21) with audio input being picked up by Docker, so for a smoother on boarding process I recommend using the [Debian package](http://voice2json.org/install.html#debian-package) which you can find in their [GitHub releases](https://github.com/synesthesiam/voice2json/releases).

You will also need to [download a profile](http://voice2json.org/install.html#download-profile), for English I went for their first timers recommendation of 'Pocketsphinx'. Download the [.tar.gz file](https://github.com/synesthesiam/en-us_pocketsphinx-cmu/releases) and extract to `$HOME/.config/voice2json`. This is essentially your trained offline machine learning model.

## Basic usage

First, you will need to run the command:
```
voice2json train-profile
```
which should only take a second or two.

To check that everything is working, you can run the command:
```bash
voice2json transcribe-stream --open
```
and this should transcribe your speech and output various related information in a json format to `stdout`. Now, I have a Northern English accent so the transcriptions for me certainly weren't perfect. However the power comes from this tool when combining speech recognition with intent recognition.

You can define a set of phrases which relate to a given 'intent', so "Turn on the living room lamp" might be mapped to the intent `ChangeLightState`. These intent mappings are defined in the file `$HOME/.config/voice2json/sentences.ini` and you can see an example one [here](https://github.com/synesthesiam/en-us_pocketsphinx-cmu/blob/master/sentences.ini). For more details see [how it works](http://voice2json.org/#how-it-works).

So the following command:
```bash
voice2json transcribe-stream | voice2json recognize-intent
```
will try to match your spoken words to the closest matching phrase and hence intent. I found that when using a hand full of phrases the tool was very good at finding the right intent, even with my Northern English accent!

## How to execute commands
Now that we've got the tool recognizing our intent from a set of possibilities how can we now use this to execute terminal commands?

### Fifo named pipe
First off we need to make a fifo (first in first out) [named pipe](https://man7.org/linux/man-pages/man7/fifo.7.html), this will ultimately allow us to stream commands from one terminal to another. Let's create a pipe named `/tmp/mypipe` which will create a file in this location:
```bash
mkfifo /tmp/mypipe
```

### Decide your set of commands
For my first set of commands, I chose a few basic git commands. I saved the following to `$HOME/.config/voice2json/sentences.ini`:
```
[~/status.sh]
status

[~/fetch.sh]
fetch

[~/diff.sh]
diff
```
which maps the speech "status", for example, to the intent `~/status.sh`, which is actually a file saved to my machine in this location which will be executed later.

The three files to be executed are:
 - `~/status.sh`
```bash
#!/bin/bash
git status
```
 - `~/fetch.sh`
```bash
#!/bin/bash
git fetch --verbose
```
 - `~/diff.sh`
```bash
#!/bin/bash
git diff --exit-code
```
You must ensure to make these files executable by running `sudo chmod +x <file>` on each of them.

### Listen for commands
The following command will execute any lines that are written to the named pipe `/tmp/mypipe`, run this in a terminal within a git repository:
```bash
tail -f /tmp/mypipe | sh &
```

### Send intent to named pipe
Open a second terminal and run the following command:
```bash
voice2json transcribe-stream | voice2json recognize-intent | (while read -r LINE; do echo "line is: $LINE"; echo "$LINE" | jq -r '.intent.name' > /tmp/mypipe; done;)
```
Effectively every time the voice2json tool recognizes an intent, the json blob is echoed to `stdout` but it is also piped to the `jq` tool which extracts the intent name, in this case the name of a file, and pipes it to the named pipe `/tmp/mypipe`.

What you should then see if you say the word "status" for example is for the command `git status` to be ran in the first terminal.

### Seranade.ai

If like me you now work from home, it's a little bit more acceptable to talk to your computer whilst you work than in an office. However my dog keeps thinking I have a ball to throw when shouting "fetch" at my computer...
