# neighbourhood-map

## Introduction
- This map contains my locations of interest (restaurants and bars of course!).

## How to use
- Using the unix terminal, cd to the project folder and run `python -m SimpleHTTPServer`. Open `localhost:8000` in your favourite browser.

## How to use
- Click on a location marked on the map with the fork-spoon icon. This will display the information about the place from Zomato.


## Technical notes

- Zomato's public API was used. More info [here](https://developers.zomato.com/api)
- JQuery was not used since it doesn't seem sensible to use a 64Kb dependency just for the network call to Zomato.
