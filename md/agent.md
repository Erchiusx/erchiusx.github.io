# Towards Flexible Agent CLI

When people build *agentic systems*, two mysterious tendencies often appear:

+ They design systems for ^GUI use only^.
+ They aim for ^purely automatic systems^.

Some developers do attempt an *agent CLI*, yet even then, it’s often highly automatic—less managed, less flexible.

This partition of use cases tends to be ignored. However, there remains a real need for *flexible, fully controlled agents*—tools that let users, for example, manually specify a list of files to read, or interact step-by-step with the agent’s logic.

# For Shell Integration / Composition

Today we have a variety of tools that generate prompts for LLMs. The most common pattern is to extract data from a _so-called_ *knowledge base*. But our approaches to *composing prompts* are generally inefficient. The only flexible method most people use is to *copy, paste, and concatenate.*

Consider this: you want to insert the output of a command or your clipboard contents into a prompt. Typical agent CLIs provide options like `chat --clipboard` or `chat --edit`, which simply pass your clipboard content into the model (sometimes after a quick edit). And that’s it.

While such options “do one thing,” the UNIX philosophy reminds us not only to “do one thing” but to ^DO IT BEST^. Current integrations lack *composability*—arguments (`args`) are the only handles we get. That’s too rigid for a system that should thrive on modularity.

# REPL-ish Agents

```Some may have doubts
What is beyond args?
Traditional tools also rely only on args,
and they provide extremely well composibility.
```

That’s true for traditional systems—but agents are not traditional tools.
Agents don’t just process simple data—they interpret *context*, they integrate with your *system capabilities*, and increasingly, *multi-modal inputs*.

At their core, agents are *tools that hold context* and *respond dynamically* to your input. In that sense, they’re remarkably similar to REPLs (Read–Eval–Print Loops). I call this the `REPL nature of agents`.

Every major requirement of an agent echoes the REPL concept:

+ multi-round conversation mirrors shell session state;
+ managed resources and input data correspond to REPL variables.

Once you recognize this, it becomes easy to write small tools and plugins to compose prompts more flexibly.
The rigid `--clipboard` option evolves into a *pipeline* — something like:

```
xclip | parse | transform | user_defined_function
```

Each step becomes a piece of your composable agent workflow.

# Implementation

Now, how do we implement such a REPL elegantly?

This concept should live inside each language’s most natural REPL environment. Let’s take JavaScript as an example.

Launching a REPL in Node.js is straightforward. Adding `zx` helps integrate shell-like plugins smoothly.

The core idea: expose a *magic function* in the REPL that accepts *literate, composable input*—something that feels like writing Markdown, but with double backticks for clarity.

`````javascript
await ask`use the tagged template string syntax
to accept literate strings,
${interpolations} ``and fenced area``
the writing feeling is just like markdown with
every sequence of backtick extended once more,
i.e. one -> two, three -> four.

````handler
yes, a little bit of magic used here allows
codeblock-ish syntax. and replace handler
with a real plugin's name, like ``shell``,
will embed the output of the plugin into
the prompt to compose the prompt.
This is my answer to composibility.
````
similarly, used an empty template string to
exit the plugin's environment
(oh, poor highlight.js
    does not make this highlight correct
,,, not even close
)
`() // use empty arguments' call at last 
// to invoke LLM
`````

# In short
this pattern merges literate programming, shell composability, and REPL interaction into one coherent CLI paradigm—a genuinely *flexible agent interface*.

