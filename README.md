# COMPOSE

Hi! This is Collaborative Online Math Problem Organization and Sharing Environment (COMPOSE), a place to write problems for these tournaments! The COMPOSE platform was originally developed by [Mustang Math](https://mustangmath.com/), a 501(c)(3) nonprofit organization of committed high school and college volunteers who are dedicated to promoting a spirit of collaboration among middle school students around the world and piquing their curiosity in mathematics.

## Tourmaments Using COMPOSE
Here are the current tournaments that are utilizing COMPOSE:
* [Mustang Math](https://mustangmath.com/)
* [Stanford Math Tournament](https://www.stanfordmathtournament.com/)

If you are using COMPOSE but your name is not on this list, please contact **tech@mustangmath.com** to be added.

## Adopting COMPOSE for your tournament
To use COMPOSE for your own math tournament, follow the steps below.

### Step 1: Forking the Repository
Navigate to the [COMPOSE Github](https://github.com/MustangMath-Tournament/COMPOSE). 

Go to the top right corner where you will find a series of three buttons: Watch, Fork, and Star. Click the Fork button.

You will be redirected to a new screen. Here, change the owner and name of the repository to be what your organization desires. You also have the spot to add an optional description.

> **IMPORTANT**: We recommend that you fork this repository in a private account rather then a team. This is because using Vercel in a team costs money. Investigate the cost of Vercel before proceeding if you plan on forking the repository in a team.

Once you are satisfied with the repository settings, click "Create fork" to proceed to the next step.

### Step 2: Updating `scheme.json`
To customize COMPOSE to your organization, you will need to edit a scheme.json file. Navigate to this file by going `src` > `lib` > `scheme.json`.

In this file, you will have the ability to customize many aspects of the website. This includes your tournament's name, logo, color scheme, etc. 

To edit this file, click on the pencil icon on the top right of the code preview panel. This button can be found next to the "raw," "copy," and "download" buttons.

Make the necessary edits by changing the text in the strings for each of the different fields. DO NOT CHANGE THE KEYS IN THIS DICTIONARY.

Once you are satisfied with your changes, click "Commit changes...". This will lead a popup to appear. Make sure that you have selected "Commit directly to the `master` branch" and click "Commit changes." 

Now, the COMPOSE platform should be customized to your organization.

### Step 3: Setting Up Supabase & Populating the Tables
Create a Supabase account for your organization. Most likely, this will be through a Github account associated with the tournament, but this is not required.

Once you log into the account, click "New project" and then "New organization." Write the name of your tournament into the "name" input box and then click "Create organization." 

Next, an input box will be added to the webpage that reads "Name" (as it requests for the project name). Type in "COMPOSE" into here. The next input box neath that is "Database Password." We recommend that you click the "Generate a password" button right beneath the input box instead of generating your own for more security. Make sure to store the generated password somewhere safe. This should redirect you to a new page.

This database will store all the platform's accounts, problems, tests, etc. Supabase is extremely secure and one of the easier databases to utilize. The first thing you need to do is set up all the tables within the database for the platform to function properly.

Go back to your Github repository and go into the sql folder. Do the following steps for **every file** within the SQL folder:
1. Go into your Supabase project and click the "SQL Editor" tab.
2. Copy the contents from your selected SQL file in the Github repository
3. Paste the contents into the open SQL Editor
4. Click the "RUN" button on the top right corner of the terminal
5. Make sure that the console returns a message along the lines of "Succesfully executed." If this is not the case, please contact tech@mustangmath.com with the message you recieved.

After following those steps for all the files, confirm that tables were created in Supabase by going into the "Table Editor" tab in your project. You should see a bunch of newly populated tables on the left hand side.

### Step 4: Setting your Domain URL
One last step that needs to be completed in Supabase is setting your domain URL. Users are required to verify the email that they submit when creating their account to ensure no fraud occurs. Supabase needs to know what your website domain is to ensure that the email verification works successfully.

To set this, go into the "Authentication" and "URL Configuration" tab. Under the "Site URL" section of the page, change the url from "http://localhost:3000" to whatever your domain is going to be. MAKE SURE TO INCLUDE "http://" OR "https://" AT THE BEGINNING OF YOUR URL OR IT WILL NOT WORK.

### Step 5: Supabase Tips and Tricks (Optional)
Here are some helpful tips for navigating Supabase. If you would like to see other tips and tricks added to this section, send an email to tech@mustangmath.com.

#### Email Verification Templates
When a user sign up for COMPOSE, it sends an email to them asking them to verify. If you want, you can customize what these templates look like! In order to do so, go into the "Authentication" > "Email Templates" tab in the Supabase project. You can customize each of these templates using CSS.

#### Adding Users to Organization
If you want multiple users to have access to the COMPOSE database, then you can add Supabase accounts to your organization. In order to do so, go into the [Supabase homepage](https://supabase.com/dashboard/projects). On the left side, click on your organization and then go into the "Team" tab. Here, you can "Invite" users to your organization and give them different roles based on how much permissions you want them to have.

#### Checking COMPOSE Users
If you want to see which users signed up for your organization, go into your Supabse project > "Authentication" > "Users." Here, you can find a list of all the users that have signed up for your COMPOSE. Clicking three dots on the right side of every row will allow you to delete users, send a password recovery email, or other settings that you may need.

### Step 6: Setting Up Discord Webhooks
Discord Webhooks are necessary on COMPOSE because it will send a notification to a channel in a server whenever problems are created, edited, or deleted. This can help you keep a log of these problems. To set up this webhook, follow the preceeding instructions.

Go into your Discord server and then click on the title on the top of the channels list. When the dropdown opens, click "Server Settings." This should open up a new popup windows with lots of different settings for your Discord server.

On the left side, click on the "Integrations" tab. On this tab, click on the "Webhooks" section. In this section, you should see a "New Webhook" button on the top. This should add a new webhook to your list of webhooks.

Select the webhook. Feel free to change the name and which channel your webhook sends its updates. The only important thing here is the webhook URL, which you will need for step 8. Either copy that and save it somewhere, or just come back to this spot when you arrive at step 8 and need to use the URL.

### Step 7: Connecting to Vercel (Optional if you have an Alternative Hosting Method)
THIS STEP IS OPTIONAL IF YOU HAVE AN ALTERNATIVE METHOD OF HOSTING.

Now that you have made your changes, it is time to actually connect your application to a domain (as creating a fork without creating the actual website defeats the purpose of this).

To do so, navigate to [Vercel](https://vercel.com/). Click "Sign Up" and then "Continue with GitHub." Connect the GitHub account that contains the COMPOSE repository.

Once you have created the account and gotten into the Vercel dashboard, click on "Add New..." and "Project." 

Import the correct GitHub repository and then when you are navigated onto the new screen, click "Deploy." It should deploy without errors and output a Vercel link to view your application.

Once you have the application running, go into the "Settings" and then "Domains" tab. Copy the URL of your website onto the input box and click "Add." Then, follow the Vercel instructions to connect Vercel to your custom domain.

### Step 8: Adding Environment Variables
Environment variables are secret variables that people viewing your repository will not have access to. This ensures security for the Supabase database with your test problems. You will need to add 5 to your project.

The location of where you have to add your environment variables will vary based on your hosting service. In Vercel, you can add your environment variables by going into the "Settings" and "Environment Variables" tab.

The 5 environment variable keys:
* VITE_SUPABASE_URL
* VITE_SUPABASE_ANON_KEY
* VITE_DISCORD_ID
* VITE_DISCORD_TOKEN
* VITE_PDF_GENERATOR_URL

The value to VITE_SUPABASE_URL can be found on Supabase in "Project Settings" > "API" > "Project URL" > "URL".

The value to VITE_SUPABASE_ANON_KEY can be found on Supabase in "Project Settings" > "API" > "Project API Keys" > "anon public".

To get the value of VITE_DISCORD_ID and VITE_DISCORD_TOKEN, copy the webhook URL from Discord (There should be a "Copy Webhook URL" button where you created the webhook in step 6). It should look as follows: 

> https://discord.com/api/webhooks/11111111/2222222222222222222222222222222222

The number between "/webhooks" and "/" will be the VITE_DISCORD_ID (in this example: 11111111). The number after the last "/" will be the VITE_DISCORD_TOKEN (in this example: 2222222222222222222222222222222222).

Contact tech@mustangmath.com if you want the value to VITE_PDF_GENERATOR_URL.

### Congrats!
Now, COMPOSE should be set up and ready to use for your organization!

## Thank you!