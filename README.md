# Window Seat

Which side of the plane has the view? Pick two airports and a departure time, and Window Seat tells you which side to sit on and what you will pass, from Mount Rainier to the Nā Pali Coast.

An unofficial fan project, not affiliated with any airline.

## How it works

1. Draws the direct (great-circle) path between the two airports and samples a point every 10 km.
2. For each landmark, finds the closest point on the path and whether the landmark is to the left or right of the direction of travel.
3. Works out the sun's position at each point and time, so mountains do not count after dark, and a sunrise or sunset counts toward the side it is on.
4. Adds up a score per side and recommends the better one.

Real flights bend for weather, traffic and runway direction, so treat the answer as a good guess.

## Layout

- `src/core` — the logic, with no UI or browser dependencies. Each file has a test file beside it.
- `src/data` — airports and the hand-picked landmark list.
- `src/App.tsx` — the page.

## Running it

Requires Node 18 or newer (`nvm use`).

```
npm install
npm test        # run the unit tests
npm run dev     # start the app locally
npm run build   # type-check and build
```
