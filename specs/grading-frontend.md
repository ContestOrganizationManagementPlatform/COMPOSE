# Grading Frontend

## Goal
Provide a clean way for a grader to be fed answers to a particular problem and immediately mark them correct or incorrect. It should be intuitive, efficient, and workable on mobile and desktop

## Integration with Backend
- Assume you're given the following from the backend for any particular student's answer to a particular problem.
  - An image of the student's answer sheet
  - A set of coordinates for the starting bounding box where the student's answer to this problem is.
  - Name of the test
  - Problem number on the test
  - Correct Answer to problem
- You want to give back to the backend
  - Did the grader mark it right, wrong, or unsure.

## Design Specs
- [Figma](https://www.figma.com/file/7KZ8a0b9cTw40sBhwllivu/Untitled?type=design&node-id=2%3A24&mode=design&t=s9iZFEWGQA7FK55a-1)
- Layout
  - Problem information, such as the Test, Problem #, and the correct answer should be large and at the top of the page.
  - Student's answer should be below it
  - Buttons/other tools to interact with the student answer should be below it.
- Problem Information
  - The correct answer to the problem should be large and centered
  - Test Name and Problem # could be small and above it (like the header of a document)
- Student Answer
  - Should start as an image that just displays the student's answer box
  - Ideally, grader can zoom out or in as necessary if they need to see more of the surroundings
- Grading
  - Mobile
    - Grader can swipe right for correct, left for wrong, and up for confused/unsure
    - Grader can alternatively press buttons with check mark, x mark, ? mark for the same purpose.
    - Grader has button to go back to last graded (if they clicked the wrong button/swiped the wrong way)
  - Computer
    - Grader can use keyboard to quickly grade things (e.g. A for wrong, S for unsure, D for correct)
    - Grader still has clickable buttons with check mark, x mark, ? mark for the same purpose.
    - Grader has button to go back to last graded (if they clicked the wrong button/swiped the wrong way)

## Tech References/Tips
 - [SvelteKit Docs](https://svelte.dev/docs/introduction)
   - This is the official documentation for Svelte, which is what we use for frontend.
   - It's sometimes hard to understand and navigate. I've had the most luck using ctrl+F/google to find the right page.
 - [ChatGPT](https://chat.openai.com)
   - Unironically very helpful for figuring out how to do certain svelte or HTML things. Just ask it!
 - Existing Code
   - Use the [existing components](https://github.com/ContestOrganizationManagementPlatform/COMPOSE/tree/master/src/lib/components) as reference! You will want to make new Svelte Components for various things (such as a swipeable card)
   - Also look at the [existing routes and pages](https://github.com/ContestOrganizationManagementPlatform/COMPOSE/tree/master/src/routes)! You'll want to use this to create a separate page for grading, for example. 
