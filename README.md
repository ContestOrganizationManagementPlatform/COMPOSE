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

### Step 3: Setting Up the Supabase Database
<still needs to be completed>

### Step 4: Supabase Tips and Tricks
<still needs to be completed>
(this includes email verficiation, the email url, checking users, etc.)

### Step 5: Setting Up Discord Webhooks
<still needs to be completed>

### Step 6: Connecting to Vercel (Optional)
THIS STEP IS OPTIONAL IF YOU HAVE AN ALTERNATIVE METHOD OF HOSTING.

Now that you have made your changes, it is time to actually connect your application to a domain (as creating a fork without creating the actual website defeats the purpose of this).

To do so, navigate to [Vercel](https://vercel.com/). Click "Sign Up" and then "Continue with GitHub." Connect the GitHub account that contains the COMPOSE repository.

Once you have created the account and gotten into the Vercel dashboard, click on "Add New..." and "Project." 

Import the correct GitHub repository and then when you are navigated onto the new screen, click "Deploy." It should deploy without errors and output a Vercel link to view your application.

Once you have the application running, go into the "Settings" and then "Domains" tab. Copy the URL of your website onto the input box and click "Add." Then, follow the Vercel instructions to connect Vercel to your custom domain.

### Step 7: Adding Environment Variables
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

To get the value of VITE_DISCORD_ID and VITE_DISCORD_TOKEN, get the webhook URL from Discord. It should look as follows: 

> https://discord.com/api/webhooks/11111111/2222222222222222222222222222222222

The number between "/webhooks" and "/" will be the VITE_DISCORD_ID (in this example: 11111111). The number after the last "/" will be the VITE_DISCORD_TOKEN (in this example: 2222222222222222222222222222222222).

Contact tech@mustangmath.com if you want the value to VITE_PDF_GENERATOR_URL.

### Congrats!
Now, COMPOSE should be set up and ready to use for your organization!

## Thank you!