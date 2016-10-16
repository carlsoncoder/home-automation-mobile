# Carlson Home Automation Mobile Application

This is the source code for my home automation mobile application.  It relies on having the garage-mqtt-client and home-automation-webserver up and running already.

There isn't really much you need to change to get this working.  All you need to do is modify the "BaseHomeAutomationUrl" static property in /src/config/app-config.ts:

        static BaseHomeAutomationUrl: string = 'https://carlsonhomeautomation.com/'

Change that to the base URL for your home automation web server and you should be good to go!

Feel free to reach out to me at Twitter via [@carlsoncoder](https://twitter.com/carlsoncoder "@carlsoncoder") with any questions, or check out [my blog.](http://www.carlsoncoder.com/ "Carlson Coder Blog")

Thanks,
Justin

License
----
All code in this repository that was created by me is considered [Beerware](http://en.wikipedia.org/wiki/Beerware "Beerware")
