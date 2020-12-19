# Puppetplays web

Puppetplays public website, build with NextJS, data is coming from CraftCMS GraphQL API

## Install

```
yarn
```

## Configuration

Add a `.env.local` file at the root of the `puppetplays-web` directory and set the `API_URL` env variable inside to point to the craft api domain (it should be a different domain than the one of the Craft admin so that Craft can differentiate the two).