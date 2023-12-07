# Discord Integration

## Goal
Use Discord as a way to facilitate more interaction between problem writers and the COMPOSE Platform. The goal is to use a combination of discord messages, forum posts, threads, and DMs to facilitate problem writers to think about and give feedback on each other's problems in a more natural, everyday manner.

## Specs
- Keep a [Discord Forum](https://discord.com/blog/forum-channels-space-for-organized-conversation) that mimics the database.
  - Use tags to keep track of subjects
  - Automatically "close" posts after periods of inactivity?
  - Use interactable buttons/components to include links to problem-specific links on COMPOSE (e.g. view problem, edit problem, provide feedback)
  - Have problem edits and new feedback updated in the relevant forum discussion
- Problem Creation
  -   Make new post in forum using [Embeds](https://discord.com/developers/docs/resources/channel#embed-object)
  -   Use [Discord Interactions](https://discord.com/developers/docs/interactions/message-components) under the post to have relevant buttons (view problem, edit problem, add feedback) that link to the relevant COMPOSE pages
  -   Store the ID of the forum post in the COMPOSE Database so that it can be easily found and edited later. 
- Problem Editing
  - Find and edit the relevant forum thread with the new updates made to a particular problem. 
- Adding Feedback
  - When official feedback is added to COMPOSE, send a feedback added embed to the relevant forum thread
  - Add relevant buttons (view feedback, edit problem) to feedback message.
  - ~~DM Author that feedback has been added~~
