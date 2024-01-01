# CDULE

Schedule your daily life's spending

## Live app:
https://cdule.netlify.app/

## Idea

Its 2023 and I'm still a university student in RUET. My parents gave me money and I couldn't remember where I spent them. So, this app will track my daily spendings and give me some graphical representation of how much I spend in a day, week, or month.

## Functionality

1. Write daily spendings in the start page.
2. Delete if you made a mistake (no edits)
3. get tabular or graphical interface
    * Head to `This Week` or `This Month` page for tabular interface of day to doay spendings
    * Head to `Stats` page to get graphical interface.
        * There, you will find `today`, `week`, `month` tabs to be navigated
    * Head to `Causes` page to get information about how much you spent for a specific cause daily, monthly or weekly
  
4. Import/export schedules
5. [PWA](https://web.dev/explore/progressive-web-apps) support

This app stores schedules in [indexed db](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). This is a local storage which can store vast number of data in a device.

This app do not store any data to database. So, only you (the user) will know what schedule you have saved. 
Export schedules from `import/export` page and import it on another device to reuse them. However, stats won't sync with 2 devices. This is a pitfall of not to storing schedules in a database.

This app has offline support. So you can use it anytime and  anywhere you like. It also can be installed in different devices as pwa that will give a native app feeling

## Contributing

Head to the [contributing page](https://github.com/shu-vro/cdule/blob/main/CONTRIBUTING.md)

